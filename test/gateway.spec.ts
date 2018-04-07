import "mocha";
import {expect} from "chai";
import {Gateway, GatewayBFF, IGatewayBFFConfiguration} from "../lib/gateway";
import {FRAGMENT_RENDER_MODES} from "../lib/fragment";

describe('Gateway', () => {
    const commonGatewayConfiguration: IGatewayBFFConfiguration = {
        name: 'Browsing',
        api: [],
        fragments: [],
        isMobile: true,
        port: 4446,
        url: 'http://localhost:4446/'
    };

    it('should create new gateway', function () {
        const gatewayConfiguration = {
            name: 'Browsing',
            url: 'http://localhost:4446/'
        };

        const browsingGateway = new Gateway(gatewayConfiguration);
        expect(browsingGateway.name).to.eq(gatewayConfiguration.name);
        expect(browsingGateway.url).to.eq(gatewayConfiguration.url);
    });

    it('should create new gateway BFF instance', function () {
        const bffGw = new GatewayBFF(commonGatewayConfiguration);
        expect(bffGw).to.be.instanceOf(GatewayBFF);
    });

    it('should create a new gateway bff instance with single fragment', function () {
        const gatewayConfiguration: IGatewayBFFConfiguration = {
            ...commonGatewayConfiguration,
            fragments: [
                {
                    name: 'boutique-list',
                    version: 'test',
                    render: {
                        url: '/'
                    },
                    testCookie: 'fragment_test',
                    versions: {
                        'test': {
                            assets: [],
                            dependencies: [],
                            handler: require('./fragments/boutique-list/test')
                        }
                    }
                }
            ]
        };

        const bffGw = new GatewayBFF(gatewayConfiguration);
        expect(bffGw).to.be.instanceOf(GatewayBFF);
    });

    it('should expose public configuration reduced', function () {
        const gatewayConfiguration: IGatewayBFFConfiguration = {
            ...commonGatewayConfiguration,
            fragments: [
                {
                    name: 'boutique-list',
                    version: 'test',
                    render: {
                        url: '/'
                    },
                    testCookie: 'fragment_test',
                    versions: {
                        'test': {
                            assets: [],
                            dependencies: [],
                            handler: require('./fragments/boutique-list/test')
                        },
                        'test2': {
                            assets: [],
                            dependencies: [],
                            handler: require('./fragments/boutique-list/test2')
                        }
                    }
                }
            ]
        };

        const bffGw = new GatewayBFF(gatewayConfiguration);

        expect(bffGw.exposedConfig).to.deep.include({
            fragments: {
                'boutique-list': {
                    assets: [],
                    dependencies: [],
                    render: {
                        url: '/'
                    },
                    version: 'test'
                }
            }
        });
        expect(bffGw.exposedConfig.hash).to.be.a('string');
    });

    it('should render fragment in stream mode', async function () {
        const gatewayConfiguration: IGatewayBFFConfiguration = {
            ...commonGatewayConfiguration,
            fragments: [
                {
                    name: 'boutique-list',
                    version: 'test',
                    render: {
                        url: '/'
                    },
                    testCookie: 'fragment_test',
                    versions: {
                        'test': {
                            assets: [],
                            dependencies: [],
                            handler: require('./fragments/boutique-list/test')
                        }
                    }
                }
            ]
        };

        const bffGw = new GatewayBFF(gatewayConfiguration);
        expect(await bffGw.renderFragment('boutique-list', FRAGMENT_RENDER_MODES.STREAM)).to.eq('test');
    });

    it('should render fragment in preview mode', async function () {
        const gatewayConfiguration: IGatewayBFFConfiguration = {
            ...commonGatewayConfiguration,
            fragments: [
                {
                    name: 'boutique-list',
                    version: 'test',
                    render: {
                        url: '/'
                    },
                    testCookie: 'fragment_test',
                    versions: {
                        'test': {
                            assets: [],
                            dependencies: [],
                            handler: require('./fragments/boutique-list/test')
                        }
                    }
                }
            ]
        };

        const bffGw = new GatewayBFF(gatewayConfiguration);
        expect(await bffGw.renderFragment('boutique-list', FRAGMENT_RENDER_MODES.PREVIEW)).to.eq(`<html><head><title>Browsing - boutique-list</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /></head><body>test</body></html>`);
    });

    it('should throw error at render when fragment name not found', function (done) {
        const gatewayConfiguration: IGatewayBFFConfiguration = {
            ...commonGatewayConfiguration,
            fragments: [
                {
                    name: 'boutique-list',
                    version: 'test',
                    render: {
                        url: '/'
                    },
                    testCookie: 'fragment_test',
                    versions: {
                        'test': {
                            assets: [],
                            dependencies: [],
                            handler: require('./fragments/boutique-list/test')
                        }
                    }
                }
            ]
        };

        const bffGw = new GatewayBFF(gatewayConfiguration);
        bffGw.renderFragment('not_exists').then(data => done(data)).catch((e) => {
            expect(e.message).to.include('Failed to find fragment');
            done();
        });
    });
});