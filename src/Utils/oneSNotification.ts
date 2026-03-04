// utils/oneSNotification.ts
class OneSNotification {
  private static instance: OneSNotification;
  private container: HTMLDivElement | null = null;
  private messageDiv: HTMLDivElement | null = null;

  private constructor() {
    this.createContainer();
  }

  static getInstance(): OneSNotification {
    if (!OneSNotification.instance) {
      OneSNotification.instance = new OneSNotification();
    }
    return OneSNotification.instance;
  }

  private createContainer() {
    // Удаляем старый контейнер, если есть
    const oldContainer = document.getElementById("ones-notification");
    if (oldContainer) {
      oldContainer.remove();
    }

    // Создаем новый контейнер
    this.container = document.createElement("div");
    this.container.id = "ones-notification";
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      display: none;
    `;

    this.messageDiv = document.createElement("div");
    this.messageDiv.style.cssText = `
      background-color: #fff;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 16px 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: Arial, sans-serif;
      font-size: 14px;
      color: #333;
      display: flex;
      align-items: center;
      gap: 16px;
    `;

    this.container.appendChild(this.messageDiv);
    document.body.appendChild(this.container);
  }

  show(message: string, duration: number = 3000) {
    if (!this.container || !this.messageDiv) {
      this.createContainer();
    }

    // Очищаем и добавляем новое сообщение
    this.messageDiv!.innerHTML = `
      <span>${message}</span>
      <button style="
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      ">OK</button>
    `;

    // Добавляем обработчик на кнопку
    const button = this.messageDiv!.querySelector("button");
    button?.addEventListener("click", () => {
      this.hide();
    });

    // Показываем
    this.container!.style.display = "block";

    // Автоматически скрываем через duration
    if (duration > 0) {
      setTimeout(() => this.hide(), duration);
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = "none";
    }
  }
}

export const notify = (message: string) => {
  OneSNotification.getInstance().show(message);
};
