/**
 * EventBus.js - The Cosmic Nervous System
 * 
 * This module implements the Event-Driven Architecture (EDA) that serves as the
 * functional nervous system of the cosmos. It provides a publish-subscribe pattern
 * that decouples all components, preventing bottlenecks and ensuring a highly
 * resilient, asynchronous system.
 */

class EventBus {
    constructor() {
        this.subscribers = new Map();
        this.eventHistory = [];
        this.maxHistorySize = 1000;
        this.isDebugMode = false;
        this.isInitialized = false;
    }

    /**
     * Initialize the EventBus
     */
    initialize() {
        this.isInitialized = true;
        console.log('📡 EventBus initialized');
    }

    /**
     * Subscribe to an event type
     * @param {string} eventType - The type of event to subscribe to
     * @param {Function} callback - The callback function to execute
     * @param {Object} context - The context (this) for the callback
     * @returns {Function} - Unsubscribe function
     */
    subscribe(eventType, callback, context = null) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }

        const subscription = {
            callback,
            context,
            id: this.generateSubscriptionId()
        };

        this.subscribers.get(eventType).push(subscription);

        // Return unsubscribe function
        return () => {
            const eventSubscribers = this.subscribers.get(eventType);
            if (eventSubscribers) {
                const index = eventSubscribers.findIndex(sub => sub.id === subscription.id);
                if (index !== -1) {
                    eventSubscribers.splice(index, 1);
                }
            }
        };
    }

    /**
     * Publish an event to all subscribers
     * @param {string} eventType - The type of event
     * @param {Object} payload - The event data
     * @param {Object} source - The source of the event
     */
    publish(eventType, payload = {}, source = null) {
        const event = {
            type: eventType,
            payload,
            source,
            timestamp: performance.now(),
            id: this.generateEventId()
        };

        // Store in history
        this.eventHistory.push(event);
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }

        // Notify subscribers
        const eventSubscribers = this.subscribers.get(eventType);
        if (eventSubscribers) {
            eventSubscribers.forEach(subscription => {
                try {
                    if (subscription.context) {
                        subscription.callback.call(subscription.context, event);
                    } else {
                        subscription.callback(event);
                    }
                } catch (error) {
                    console.error(`Error in event handler for ${eventType}:`, error);
                }
            });
        }

        // Debug logging
        if (this.isDebugMode) {
            console.log(`[EventBus] Published: ${eventType}`, event);
        }
    }

    /**
     * Publish multiple events in sequence
     * @param {Array} events - Array of {type, payload, source} objects
     */
    publishBatch(events) {
        events.forEach(event => {
            this.publish(event.type, event.payload, event.source);
        });
    }

    /**
     * Get all subscribers for an event type
     * @param {string} eventType - The event type
     * @returns {Array} - Array of subscription objects
     */
    getSubscribers(eventType) {
        return this.subscribers.get(eventType) || [];
    }

    /**
     * Get event history
     * @param {string} eventType - Optional filter by event type
     * @param {number} limit - Maximum number of events to return
     * @returns {Array} - Array of historical events
     */
    getHistory(eventType = null, limit = 100) {
        let history = this.eventHistory;
        
        if (eventType) {
            history = history.filter(event => event.type === eventType);
        }

        return history.slice(-limit);
    }

    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
    }

    /**
     * Enable/disable debug mode
     * @param {boolean} enabled - Whether to enable debug mode
     */
    setDebugMode(enabled) {
        this.isDebugMode = enabled;
    }

    /**
     * Get statistics about the event bus
     * @returns {Object} - Statistics object
     */
    getStats() {
        const stats = {
            totalSubscribers: 0,
            eventTypes: [],
            totalEvents: this.eventHistory.length,
            recentEvents: this.eventHistory.slice(-10)
        };

        this.subscribers.forEach((subscribers, eventType) => {
            stats.totalSubscribers += subscribers.length;
            stats.eventTypes.push(eventType);
        });

        return stats;
    }

    /**
     * Generate unique subscription ID
     * @returns {string} - Unique ID
     */
    generateSubscriptionId() {
        return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate unique event ID
     * @returns {string} - Unique ID
     */
    generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Destroy the event bus and clean up
     */
    destroy() {
        this.subscribers.clear();
        this.eventHistory = [];
    }
}

// Create global event bus instance
window.EventBus = new EventBus();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBus;
} 