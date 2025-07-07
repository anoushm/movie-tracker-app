import { ChatResponseModel } from './chat-response.model';
import { TrailerSegment } from './trailer-segment.model';

export interface TrailerMessage extends ChatResponseModel {
    segments: TrailerSegment[];
}
