import { LightningElement } from 'lwc';
export default class LookupTest extends LightningElement {
    lookupRecord(event) {
        console.log(event.detail);
    }
}