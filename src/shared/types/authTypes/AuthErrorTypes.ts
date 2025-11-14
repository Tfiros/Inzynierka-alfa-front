export type BodyDetailsResponseDto = {
  id?: string | null;
  email?: string | null;
  error?: string | null;
  error_description?: string | null;
  text?: string | null;
  extra?: Record<string, string> | null;
};

export type RawBodyResponse = {
  message: string;
  details: BodyDetailsResponseDto;
};
