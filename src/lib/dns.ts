export interface DNSProviderInfo {
  name: string;
  url: string;
}

const PROVIDERS: { name: string; pattern: RegExp; url: (domain: string) => string }[] = [
  {
    name: 'Cloudflare',
    pattern: /\.ns\.cloudflare\.com$/,
    url: () => 'https://dash.cloudflare.com/',
  },
  {
    name: 'GoDaddy',
    pattern: /\.domaincontrol\.com$/,
    url: (domain) => `https://dcc.godaddy.com/control/${domain}/dns`,
  },
  {
    name: 'Namecheap',
    pattern: /\.registrar-servers\.com$/,
    url: () => 'https://www.namecheap.com/myaccount/productlist/',
  },
  {
    name: 'Google Domains',
    pattern: /\.googledomains\.com$/,
    url: (domain) => `https://domains.google.com/registrar/${domain}/dns`,
  },
  {
    name: 'AWS Route53',
    pattern: /\.awsdns-\d{2}\.(com|net|org|co\.uk)$/,
    url: () => 'https://console.aws.amazon.com/route53/home',
  },
  {
    name: 'Bluehost',
    pattern: /ns\d\.bluehost\.com$/,
    url: () => 'https://my.bluehost.com/cgi-bin/cpanel',
  },
  {
    name: 'HostGator',
    pattern: /ns\d\.hostgator\.com$/,
    url: () => 'https://portal.hostgator.com/',
  },
];

export async function detectDNSProvider(domain: string): Promise<DNSProviderInfo | null> {
  try {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=NS`, {
      headers: {
        accept: 'application/dns-json',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.Answer || data.Answer.length === 0) return null;

    for (const answer of data.Answer) {
      if (answer.type !== 2) continue; // NS record type is 2
      const ns = answer.data.toLowerCase().replace(/\.$/, '');
      for (const provider of PROVIDERS) {
        if (provider.pattern.test(ns)) {
          return {
            name: provider.name,
            url: provider.url(domain),
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to detect DNS provider:', error);
    return null;
  }
}
