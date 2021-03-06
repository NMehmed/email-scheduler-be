/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface SendEmailBodySchema {
  /**
   * Send mail to
   */
  emailTo: string;
  /**
   * Mail subject
   */
  subject: string;
  /**
   * Message to sent
   */
  message: string;
  /**
   * When to be sent mail
   */
  whenToBeSent: string;
  [k: string]: unknown;
}
