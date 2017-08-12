export class Decorator {
    constructor(bus) {
        this.bus = bus;
    }

    handle(command, context = {}) {
        context.logger = console.log.bind('Masyaallaah');
        return this.bus.handle(command, context).then((result) => {
            console.log('Command Executed');
            return result;
        }).catch(err => {
            console.log('Failed to execute Command');
            throw err;
        });
    }
}