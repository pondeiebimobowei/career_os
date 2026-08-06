export interface IssueCompletedEvent {
  type: 'IssueCompleted';
  issueId: string;
  featureId: string;
  milestone: string;
  completedAt: string;
  completedBy: string;
}

export interface MilestoneCompletedEvent {
  type: 'MilestoneCompleted';
  milestone: string;
  totalIssues: number;
  durationDays: number;
  velocity: number;
}

export type DomainEvent = IssueCompletedEvent | MilestoneCompletedEvent;

export type EventHandler<T extends DomainEvent> = (event: T) => Promise<void>;

export class EventDispatcher {
  private handlers = new Map<string, EventHandler<any>[]>();

  subscribe<T extends DomainEvent>(eventType: T['type'], handler: EventHandler<T>): void {
    const list = this.handlers.get(eventType) || [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  async dispatch<T extends DomainEvent>(event: T): Promise<void> {
    const list = this.handlers.get(event.type) || [];
    for (const handler of list) {
      await handler(event);
    }
  }
}
