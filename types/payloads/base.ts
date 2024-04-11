export interface BaseWebhookPayload {
  event: string;
  user: boolean;
  owner: boolean;
  Account: {
    id: number;
    thumb: string;
    title: string;
  };
  Server: {
    title: string;
    uuid: string;
  };
  Player: {
    local: boolean;
    publicAddress: string;
    title: string;
    uuid: string;
  };
}

export interface BaseMediaWebhookPayload extends BaseWebhookPayload {
  Metadata: {
    librarySectionType: string;
    ratingKey: string;
    key: string;
    parentRatingKey: string;
    grandparentRatingKey: string;
    guid: string;
    librarySectionID: number;
    type: string;
    title: string;
    grandparentKey: string;
    parentKey: string;
    grandparentTitle: string;
    parentTitle: string;
    summary: string;
    index: number;
    parentIndex: number;
    ratingCount: number;
    thumb: string;
    art: string;
    parentThumb: string;
    grandparentThumb: string;
    grandparentArt: string;
    addedAt: number;
    updatedAt: number;
  };
}