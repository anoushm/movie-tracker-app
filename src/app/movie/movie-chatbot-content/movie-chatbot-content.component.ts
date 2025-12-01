import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, inject, computed, effect, signal } from '@angular/core';
import { MovieStore } from '../../services/movie-store';
import { CommonModule } from '@angular/common';
import { MovieTrailerComponent } from '../movie-trailer/movie-trailer.component';
import { TrailerMessage } from '../../shared/models/trailer-message.model';
import { TrailerParser } from '../../services/trailer-parser';

const THINKING_HEAD_PATH =
  'M50 30 C30 30, 20 40, 20 60 C20 80, 30 90, 50 90 C70 90, 80 80, 80 60 C80 40, 70 30, 50 30Z';
const THINKING_TOP_PATH = 'M30 20 Q40 10, 50 20 Q60 30, 70 20';
const THINKING_SMILE_PATH = 'M35 70 Q50 80, 65 70';
const SEND_PLANE_PATH =
  'M2 31.96l60-28a2 2 0 0 1 2.8 2.23l-10.5 48a2 2 0 0 1-3.18 1.12L32 46 18.48 55.82a2 2 0 0 1-3-2.16l3.6-15.94L2.5 35a2 2 0 0 1-.5-3.04zM6.8 33.6l10.1-1.82 6.4 6.5L6.8 33.6zm19.58-4.6L54.8 11.7 29.78 39l-3.4-10.04zM32.8 42.6L51 51.56l8.8-40.36L32.8 42.6z';
const FUNNY_BULB_BODY_PATH = 'M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z';
const FUNNY_BULB_BASE_PATH = 'M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z';

@Component({
    selector: 'movie-chatbot-content',
    imports: [CommonModule, MovieTrailerComponent],
    template: `
    <div class="chatbot-container">
      <div class="chatbot-header flex w-full">
        <div class="header-block text-white w-2/3">
          <h1 class="text-lg font-bold">Chatbot</h1>
          <p >Ask me anything about movies!</p>
        </div>

        <div class="header-block w-1/3 text-right">
          @if(indicatorVisible()) {
            <button
              class="funny-fact-indicator rounded-full bg-yellow-400 p-2 shadow-lg hover:bg-yellow-300 transition"
              data-testid="funny-fact-button"
              aria-label="Show funny fact"
              (click)="toggleFunnyFact()"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path [attr.d]="funnyBulbBodyPath" fill="#FFD966" stroke="#000"/>
                <path fill-rule="evenodd" clip-rule="evenodd" [attr.d]="funnyBulbBasePath" fill="#FFD966" stroke="#000"/>
                <circle cx="9" cy="9" r="1" fill="#000" />
                <circle cx="15" cy="9" r="1" fill="#000" />
                <path d="M9 12c1 1 3 2 6 0" stroke="#000" stroke-width="1.2" stroke-linecap="round" fill="none"/>
              </svg>
            </button>
          }
      </div>
    </div>
    @if(error()) {
      <div class="chatbot-loading-indicator error-message">{{ error() }}</div>
    } @else if(loading()) {
      <div class="chatbot-loading-indicator">
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
      </div>
    }
    <div #messagesContainer class="chatbot-messages" style="overflow-y: auto; padding: 15px;">
            @for (message of messages(); track message.text) {
                <div class="message" [class.user]="message.role === 'user'" [class.assistant]="message.role === 'assistant'">
                    @if(message.role === 'user') {
                    <div class="chat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                      <g transform="translate(0, 0) scale(1)">
                        <!-- User head -->
                        <circle cx="50" cy="35" r="20" fill="#fff" stroke="#000" stroke-width="4"/>

                        <!-- Shoulders / torso -->
                        <path d="M20 80 Q50 60 80 80" fill="#fff" stroke="#000" stroke-width="4"/>

                        <!-- Decorative collar line -->
                        <path d="M35 70 Q50 65 65 70" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>
                      </g>
                    </svg>

                    </div>
                    } @else {
                    <div class="chat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                        <g transform="translate(0, 0) scale(1)">
                            <path [attr.d]="thinkingHeadPath" fill="#efa21b" stroke="#000" stroke-width="4" />
                            <path [attr.d]="thinkingTopPath" fill="none" stroke="#000" stroke-width="3" />
                            <g id="thinkingDots">
                                <circle cx="40" cy="55" r="5" fill="#000">
                                </circle>
                                <circle cx="50" cy="55" r="5" fill="#000">
                                </circle>
                                <circle cx="60" cy="55" r="5" fill="#000">
                                </circle>
                            </g>
                            <path [attr.d]="thinkingSmilePath" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" />
                        </g>
                    </svg>
                    </div>
                    }
                    <div class="message-content">
                      @for (segment of message.segments; track $index) {
                        <ng-container [ngSwitch]="segment.type">
                          @if(segment.type === 'text') {
                            <span [innerHTML]="segment.html"></span>
                          } @else {
                            <movie-trailer [url]="segment.url!" [title]="segment.title"></movie-trailer>
                          }
                        </ng-container>
                      }
                    </div>
                </div>
            }
            @if(showFunnyFact()) {
            <div class="message funny-fact p-0 m-0 text-sm">
                <p class="m-0 p-0"><strong>Funny Fact:</strong> {{ funnyFact() }}</p>
            </div>
            }
        </div>

        <div class="chatbot-input-area">
            <textarea #chatbotInput rows="3" class="input-field text-black w-full mb-2" placeholder="Type your chat message here..." data-testid="chat-input" (keyup.enter)="sendChatMessage(chatbotInput.value)" (keydown.enter)="$event.preventDefault()"></textarea>
            <button class="send-button" data-testid="send-chat-button" [disabled]="loading()" (click)="sendChatMessage(chatbotInput.value)">
                @if(loading()) {
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
                } @else {
                    <img src="./assets/right-arrow.png" style="width:50px;filter: invert(1);">
                }
            </button>
        </div>
    </div>
    `,
    styleUrls: ['./movie-chatbot-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class MovieChatbotContentComponent {
    @ViewChild('chatbotInput') public chatbotInput!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('messagesContainer') public messagesContainer!: ElementRef<HTMLDivElement>;

    private store = inject(MovieStore);
    private trailerParser = inject(TrailerParser);

    protected messages = computed<TrailerMessage[]>(() => {
        const raw = this.store.chatResponse() || [];
        return raw.map((msg) => ({ ...msg, segments: this.trailerParser.parse(msg.text) }));
    });
    protected loading = computed<boolean>(() => this.store.loadingChat());
    protected error = computed<any>(() => this.store.errorChat());
    protected funnyFact = computed<string>(() => this.store.funnyFact() || '');
    protected showFunnyFact = signal<boolean>(false);
    protected indicatorVisible = computed<boolean>(() => !this.showFunnyFact() && !!this.funnyFact());

    public thinkingHeadPath = THINKING_HEAD_PATH;
    public thinkingTopPath = THINKING_TOP_PATH;
    public thinkingSmilePath = THINKING_SMILE_PATH;
    public sendPlanePath = SEND_PLANE_PATH;
    public funnyBulbBodyPath = FUNNY_BULB_BODY_PATH;
    public funnyBulbBasePath = FUNNY_BULB_BASE_PATH;

    private scrollEffect = effect(() => {
        this.messages();
        queueMicrotask(() => this.scrollToBottom());
    });

    private funnyFactEffect = effect(() => {
        const fact = this.funnyFact();
        if (fact) {
            this.showFunnyFact.set(false);
        }
    });

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
