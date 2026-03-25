import { API_BASE_URL } from "../app-config";

type MessageHandler = (data: any) => void;

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimer: any = null;
  private manualClose = false;
  private authenticated = false;

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      if (this.socket.readyState === WebSocket.OPEN && !this.authenticated) {
        this.authenticate();
      }
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) return;

    this.manualClose = false;
    this.authenticated = false;
    const wsUrl = API_BASE_URL.replace(/^http/, "ws") + "/ws";

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
      this.authenticate();
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type } = message;

        if (type === "auth.success") {
          this.authenticated = true;
        }

        if (type === "signout.success") {
            this.authenticated = false;
        }

        if (this.handlers.has(type)) {
          this.handlers.get(type)?.forEach((handler) => handler(message));
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message", e);
      }
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket closed", event.code, event.reason);
      this.authenticated = false;
      if (!this.manualClose) {
        this.reconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error", error);
    };
  }

  private authenticate() {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "auth", token }));
    }
  }

  signout() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN && this.authenticated) {
      this.socket.send(JSON.stringify({ type: "signout" }));
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max WebSocket reconnect attempts reached");
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    console.log(`Reconnecting WebSocket in ${delay}ms (attempt ${this.reconnectAttempts})`);

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  subscribe(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)?.add(handler);

    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  disconnect() {
    this.manualClose = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.authenticated = false;
  }
}

export const wsManager = WebSocketManager.getInstance();