"use strict";
// Sample TypeScript file for testing keypress notifications
// This file contains TypeScript-specific syntax for comprehensive testing
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleResponse = exports.sampleUser = exports.TestService = exports.Utils = exports.Status = exports.UserService = void 0;
exports.createPair = createPair;
// Sample class with TypeScript features
class UserService {
    logger;
    users = []; // Private field - try copying
    constructor(logger) {
        this.logger = logger;
        this.logger.log('UserService initialized');
    }
    // Async method - test copying async/await syntax
    async findById(id) {
        const user = this.users.find(u => u.id === id);
        return user || null;
    }
    // Method with destructuring - good for selection testing
    async save(user) {
        const { id, name, email, preferences } = user;
        if (!name.trim()) {
            throw new Error('Name is required');
        }
        const existingIndex = this.users.findIndex(u => u.id === id);
        if (existingIndex >= 0) {
            this.users[existingIndex] = user;
        }
        else {
            this.users.push(user);
        }
        return user;
    }
    // Arrow function property - try copying this
    delete = async (id) => {
        this.users = this.users.filter(u => u.id !== id);
    };
    async findAll() {
        return [...this.users]; // Spread operator
    }
}
exports.UserService = UserService;
// Enum for testing
var Status;
(function (Status) {
    Status["PENDING"] = "pending";
    Status["COMPLETED"] = "completed";
    Status["CANCELLED"] = "cancelled";
})(Status || (exports.Status = Status = {}));
// Generic function with constraints
function createPair(first, second) {
    return [first, second]; // Tuple return type
}
// Sample data for testing - try copying these objects
const sampleUser = {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
    }
};
exports.sampleUser = sampleUser;
const sampleResponse = {
    data: sampleUser,
    status: 200,
    message: 'Success',
    timestamp: new Date()
};
exports.sampleResponse = sampleResponse;
// Advanced TypeScript features for testing
var Utils;
(function (Utils) {
    function formatUser(user) {
        return `${user.name} (${user.email || 'No email'})`;
    }
    Utils.formatUser = formatUser;
    Utils.DEFAULT_PREFERENCES = {
        theme: 'light',
        notifications: true,
        language: 'en'
    };
})(Utils || (exports.Utils = Utils = {}));
// Decorator example (experimental)
function log(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Calling ${propertyName} with`, args);
        return method.apply(this, args);
    };
}
let TestService = (() => {
    let _instanceExtraInitializers = [];
    let _process_decorators;
    return class TestService {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _process_decorators = [log];
            __esDecorate(this, null, _process_decorators, { kind: "method", name: "process", static: false, private: false, access: { has: obj => "process" in obj, get: obj => obj.process }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        process(data) {
            return data.toUpperCase();
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
})();
exports.TestService = TestService;
//# sourceMappingURL=sample.js.map