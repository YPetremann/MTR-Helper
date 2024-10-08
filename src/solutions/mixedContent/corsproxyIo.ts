import { AbstractMixedContent } from "./AbstractMixedContent";
import { AbstractProxyResponse } from "./AbstractProxyResponse";

export class MixedContent extends AbstractMixedContent {
  readonly name = "corsproxy.io";
  readonly order = 99;
  fetch(url: string): string {
    return fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`).then(r => new ProxyResponse(r));
  }
}

class ProxyResponse extends AbstractProxyResponse {}
