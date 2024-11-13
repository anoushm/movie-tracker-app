import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, inject, computed } from '@angular/core';
import { MovieStore } from '../../services/movie-store';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'movie-chatbot-content',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="chatbot-container">
        <div class="chatbot-header" style="padding: 10px; position: absolute; top: 0; width: 100%;">
            <h1>Chatbot</h1>
            <p>Ask me anything about movies!</p>
        </div>

        <div class="chatbot-messages" 
             style="position: absolute; top: 100px; bottom: 200px; overflow-y: auto; padding: 10px;">
            @for (message of messages(); track message.text) {
                <div class="message" [class.user]="message.role === 'user'" [class.assistant]="message.role === 'assistant'">
                    <div class="message-content">{{ message.text }}</div>
                </div>
            }
        </div>
        <div class="chatbot-input-area" style="padding: 10px; position: absolute; bottom: 0; width: 100%;">
            <textarea #chatbotInput
                      class="input-field"
                      placeholder="Type your chat message here..."
                      style="width: calc(100% - 20px); margin-bottom: 10px; height: 100px;"
                      (keyup.enter)="sendChatMessage(chatbotInput.value)"
                      (keydown.enter)="$event.preventDefault()"></textarea>
            <button class="send-button"
                    style="width: 100%;"
                    [disabled]="loading()"
                    (click)="sendChatMessage(chatbotInput.value)">
                {{ loading() ? 'Thinking...' : 'Send' }}
            </button>
        </div>
    </div>
    `,
    styleUrls: ['./movie-chatbot-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieChatbotContentComponent {
    @ViewChild('chatbotInput') chatbotInput!: ElementRef<HTMLTextAreaElement>;

    private store = inject(MovieStore);

    protected messages = computed(() => this.store.chatResponse() || []);
    protected loading = computed(() => this.store.loading());

    public async sendChatMessage(message: string): Promise<void> {
        if (!message.trim() || this.loading()) return;

        try {
            await this.store.sendChatMessage(message);

            this.chatbotInput.nativeElement.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}