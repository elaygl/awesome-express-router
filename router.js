const express = require('express');
app = express();

const AwesomeRouter = function () {
    function router(req, res, next) {
        return router.handle(req, res, next);
    }

    router.routes = [];

    router.handle = function (req, res, next) {
        const handlers = this.routes
            .filter((x) => x.method === req.method || x.method === '*')
            // in real router the matching is done by regex comparison, here I used a quick workaround
            .filter((x) => req.path.startsWith(x.path))
            .map((x) => x.handler);

        let i = 0;
        let shouldContinue = true;
        while (i < handlers.length && shouldContinue) {
            const handler = handlers[i];
            shouldContinue = false;
            handler(req, res, () => {
                shouldContinue = true;
            });
            i++;
        }

        if (next && shouldContinue) next();
    };

    router.addRoute = function (method, path, handler) {
        this.routes.push({method, path, handler});
    };
    router.use = function (path, handler) {
        router.addRoute('*', path, handler);
    };
    router.post = function (path, handler) {
        router.addRoute('POST', path, handler);
    };
    router.get = function (path, handler) {
        router.addRoute('GET', path, handler);
    };

    return router;
};

const router = AwesomeRouter();
router.use('/', (req, res, next) => {
    console.log('logging', req.path);
    next();
});
router.get('/hi', (req, res, next) => {
    res.send('hi there!');
});

app.use(router);
app.listen(3000, () => {
    console.log('listening...');
});
