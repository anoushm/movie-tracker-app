import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, inject } from '@angular/core';
import { MovieStore } from '../../services/movie-store';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'movie-chatbot-content',
    standalone: true,
    template: `
        <div class="chatbot-ui" style="padding: 10px; position: absolute; bottom: 0; width: 100%;">
            <textarea #chatbotInput id="chatbot-input" placeholder="Type your message here..."
                        style="width: calc(100% - 20px); margin-bottom: 10px; height: 100px;"
                        (keyup.enter)="sendChatMessage(chatbotInput.value)" (keydown.enter)="$event.preventDefault()"></textarea>
            <button id="chatbot-send-btn" style="width: 100%;" (click)="sendChatMessage(chatbotInput.value)">Send</button>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieChatbotContentComponent {
    @ViewChild('chatbotInput') chatbotInput!: ElementRef<HTMLTextAreaElement>;

    private store = inject(MovieStore);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    public sendChatMessage(message: string): void {
        message = 'what movies did Deniro do in the mid 90s?';
        console.log('Chat message sent:', message);
        this.store.sendChatMessage(message);

        const chatReponse = this.store.chatResponse;
        console.log('Chat response:', chatReponse() ?? 'Emmpty');

        this.chatbotInput.nativeElement.value = chatReponse() ?? 'Emmpty';
    }
}