export interface NotificationMailService {
  sendWelcomeEmail(email: string): Promise<void>;
}

export const NotificationMailService = Symbol('NotificationMailService');
