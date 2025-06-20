import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, inject, computed, AfterViewInit, effect, signal } from '@angular/core';
import { MovieStore } from '../../services/movie-store';
import { CommonModule } from '@angular/common';

const THINKING_HEAD_PATH =
  'M50 30 C30 30, 20 40, 20 60 C20 80, 30 90, 50 90 C70 90, 80 80, 80 60 C80 40, 70 30, 50 30Z';
const THINKING_TOP_PATH = 'M30 20 Q40 10, 50 20 Q60 30, 70 20';
const THINKING_SMILE_PATH = 'M35 70 Q50 80, 65 70';
const SEND_PLANE_PATH =
  'M2 31.96l60-28a2 2 0 0 1 2.8 2.23l-10.5 48a2 2 0 0 1-3.18 1.12L32 46 18.48 55.82a2 2 0 0 1-3-2.16l3.6-15.94L2.5 35a2 2 0 0 1-.5-3.04zM6.8 33.6l10.1-1.82 6.4 6.5L6.8 33.6zm19.58-4.6L54.8 11.7 29.78 39l-3.4-10.04zM32.8 42.6L51 51.56l8.8-40.36L32.8 42.6z';

@Component({
    selector: 'movie-chatbot-content',
    imports: [CommonModule],
    template: `
    <div class="chatbot-container">
        <div class="chatbot-header">
            <h1>Chatbot</h1>
            <p>Ask me anything about movies!</p>
        </div>

        <div #messagesContainer class="chatbot-messages" style="overflow-y: auto; padding: 15px;">
            @for (message of messages(); track message.text) {
                <div class="message" [class.user]="message.role === 'user'" [class.assistant]="message.role === 'assistant'">
                    <div *ngIf="message.role === 'user'" class="chat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="50" height="50">

                      <circle cx="32" cy="32" r="30" fill="transparent" stroke-width="4" />
                      <circle cx="32" cy="24" r="12" fill="#fff" stroke="#efa21b" stroke-width="2" />
                      <circle cx="32" cy="24" r="8" fill="#efa21b" />
                      <path
                      d="M16 38 C 16 45, 48 45, 48 38"
                      fill="#fff"
                      stroke="#efa21b"
                      stroke-width="2"
                      />
                    </svg>
                    </div>
                    <div *ngIf="message.role === 'assistant'" class="chat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
                            <circle cx="32" cy="32" r="32" fill="#efa21b" />
                            <rect x="12" y="18" width="40" height="28" rx="4" ry="4" fill="white" />
                            <rect x="16" y="22" width="32" height="20" fill="black" />
                            <rect x="20" y="28" width="24" height="8" fill="#efa21b" />
                            <line x1="20" y1="18" x2="14" y2="10" stroke="black" stroke-width="2" />
                            <line x1="44" y1="18" x2="50" y2="10" stroke="black" stroke-width="2" />
                        </svg>
                    </div>
                    <div class="message-content">{{ message.text }}</div>
                </div>
            }
        </div>
        
        <div class="funny-fact p-0 m-0 text-sm border border-[#efa21b]" *ngIf="showFunnyFact()">
            <p class="m-0 p-0"><strong>Funny Fact:</strong> {{ funnyFact() }}</p>
        </div>

        <div class="chatbot-input-area" style="padding:10px 10px 100px;position:relative; background: rgb(244, 244, 244); border: 1px solid #ccc; border-radius: 0.25rem;">
            <textarea #chatbotInput rows="3" class="input-field text-black w-full mb-2" placeholder="Type your chat message here..." (keyup.enter)="sendChatMessage(chatbotInput.value)" (keydown.enter)="$event.preventDefault()"></textarea>
            <button class="funny-fact-indicator" *ngIf="indicatorVisible()" (click)="toggleFunnyFact()" aria-label="Show funny fact">
                🎉
            </button>
            <button class="send-button" style="position: absolute; width: 80px; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px;height: 80px; right: 10px;bottom: 10px;" [disabled]="loading()" (click)="sendChatMessage(chatbotInput.value)">
                <ng-container *ngIf="loading(); else defaultText">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                        <g transform="translate(0, 0) scale(1)">
                            <path [attr.d]="thinkingHeadPath" fill="#efa21b" stroke="#000" stroke-width="4" />
                            <path [attr.d]="thinkingTopPath" fill="none" stroke="#000" stroke-width="3" />
                            <g id="thinkingDots">
                                <circle cx="40" cy="55" r="5" fill="#000">
                                    <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0s" />
                                </circle>
                                <circle cx="50" cy="55" r="5" fill="#000">
                                    <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                                </circle>
                                <circle cx="60" cy="55" r="5" fill="#000">
                                    <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="1s" />
                                </circle>
                            </g>
                            <path [attr.d]="thinkingSmilePath" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" />
                        </g>
                    </svg>
                </ng-container>
                <ng-template #defaultText>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="50" height="50" fill="#000">
                        <path [attr.d]="sendPlanePath" />
                    </svg>
                </ng-template>
            </button>
        </div>
    </div>
    `,
    styleUrls: ['./movie-chatbot-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class MovieChatbotContentComponent implements AfterViewInit {
    @ViewChild('chatbotInput') chatbotInput!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

    private store = inject(MovieStore);

    protected messages = computed(() => this.store.chatResponse() || []);
    protected loading = computed(() => this.store.loading());
    protected funnyFact = computed(() => this.store.funnyFact() || '');
    protected showFunnyFact = signal(false);
    protected indicatorVisible = computed(() => !this.showFunnyFact() && !!this.funnyFact());

    public thinkingHeadPath = THINKING_HEAD_PATH;
    public thinkingTopPath = THINKING_TOP_PATH;
    public thinkingSmilePath = THINKING_SMILE_PATH;
    public sendPlanePath = SEND_PLANE_PATH;

    public ngAfterViewInit(): void {
        effect(() => {
            this.messages();
            queueMicrotask(() => this.scrollToBottom());
        });

        effect(() => {
            const fact = this.funnyFact();
            if (fact) {
                this.showFunnyFact.set(false);
            }
        });
    }

    private scrollToBottom(): void {
        const container = this.messagesContainer?.nativeElement;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    public toggleFunnyFact(): void {
        this.showFunnyFact.set(!this.showFunnyFact());
    }

    public async sendChatMessage(message: string): Promise<void> {
        if (!message.trim() || this.loading()) return;

        try {
            this.showFunnyFact.set(false);
            await this.store.sendChatMessage(message);

            this.chatbotInput.nativeElement.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}
