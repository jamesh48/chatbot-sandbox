import { inject, injectable } from "inversify";
import { TYPES } from "../types";

@injectable()
export class ValidateRegistrationChannel {
  private readonly RegistrationChannelID: string;
  constructor(
    @inject(TYPES.RegistrationChannelID) RegistrationChannelID: string
  ) {
    this.RegistrationChannelID = RegistrationChannelID;
  }

  public isRegistrationChannel(incomingChannel: string): boolean {
    if (incomingChannel === this.RegistrationChannelID) {
      return true;
    }
    return false;
  }
}
