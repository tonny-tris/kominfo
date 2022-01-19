
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\Tailwind.svelte generated by Svelte v3.46.1 */

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tailwind', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tailwind> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwind extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwind",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src\PDFPage.svelte generated by Svelte v3.46.1 */
    const file = "src\\PDFPage.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let canvas_1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "class", "max-w-full");
    			set_style(canvas_1, "width", /*width*/ ctx[1] + "px");
    			attr_dev(canvas_1, "width", /*width*/ ctx[1]);
    			attr_dev(canvas_1, "height", /*height*/ ctx[2]);
    			add_location(canvas_1, file, 34, 2, 814);
    			add_location(div, file, 33, 0, 806);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, canvas_1);
    			/*canvas_1_binding*/ ctx[4](canvas_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 2) {
    				set_style(canvas_1, "width", /*width*/ ctx[1] + "px");
    			}

    			if (dirty & /*width*/ 2) {
    				attr_dev(canvas_1, "width", /*width*/ ctx[1]);
    			}

    			if (dirty & /*height*/ 4) {
    				attr_dev(canvas_1, "height", /*height*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*canvas_1_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PDFPage', slots, []);
    	let { page } = $$props;
    	const dispatch = createEventDispatcher();
    	let canvas;
    	let width;
    	let height;
    	let clientWidth;
    	let mounted;

    	function measure() {
    		dispatch("measure", { scale: canvas.clientWidth / width });
    	}

    	async function render() {
    		const _page = await page;
    		const context = canvas.getContext("2d");
    		const viewport = _page.getViewport({ scale: 1, rotation: 0 });
    		$$invalidate(1, width = viewport.width);
    		$$invalidate(2, height = viewport.height);
    		await _page.render({ canvasContext: context, viewport }).promise;
    		measure();
    		window.addEventListener("resize", measure);
    	}

    	onMount(render);

    	onDestroy(() => {
    		window.removeEventListener("resize", measure);
    	});

    	const writable_props = ['page'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PDFPage> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(0, canvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('page' in $$props) $$invalidate(3, page = $$props.page);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		page,
    		dispatch,
    		canvas,
    		width,
    		height,
    		clientWidth,
    		mounted,
    		measure,
    		render
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(3, page = $$props.page);
    		if ('canvas' in $$props) $$invalidate(0, canvas = $$props.canvas);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('clientWidth' in $$props) clientWidth = $$props.clientWidth;
    		if ('mounted' in $$props) mounted = $$props.mounted;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [canvas, width, height, page, canvas_1_binding];
    }

    class PDFPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { page: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PDFPage",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*page*/ ctx[3] === undefined && !('page' in props)) {
    			console.warn("<PDFPage> was created without expected prop 'page'");
    		}
    	}

    	get page() {
    		throw new Error("<PDFPage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<PDFPage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function pannable(node) {
      let x;
      let y;

      function handleMousedown(event) {
        x = event.clientX;
        y = event.clientY;
        const target = event.target;

        node.dispatchEvent(
          new CustomEvent('panstart', {
            detail: { x, y, target },
          })
        );

        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('mouseup', handleMouseup);
      }

      function handleMousemove(event) {
        const dx = event.clientX - x;
        const dy = event.clientY - y;
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(
          new CustomEvent('panmove', {
            detail: { x, y, dx, dy },
          })
        );
      }

      function handleMouseup(event) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(
          new CustomEvent('panend', {
            detail: { x, y },
          })
        );
        window.removeEventListener('mousemove', handleMousemove);
        window.removeEventListener('mouseup', handleMouseup);
      }
      function handleTouchStart(event) {
        if (event.touches.length > 1) return;
        const touch = event.touches[0];
        x = touch.clientX;
        y = touch.clientY;
        const target = touch.target;

        node.dispatchEvent(
          new CustomEvent('panstart', {
            detail: { x, y, target },
          })
        );

        window.addEventListener('touchmove', handleTouchmove, { passive: false });
        window.addEventListener('touchend', handleTouchend);
      }
      function handleTouchmove(event) {
        event.preventDefault();
        if (event.touches.length > 1) return;
        const touch = event.touches[0];
        const dx = touch.clientX - x;
        const dy = touch.clientY - y;
        x = touch.clientX;
        y = touch.clientY;

        node.dispatchEvent(
          new CustomEvent('panmove', {
            detail: { x, y, dx, dy },
          })
        );
      }
      function handleTouchend(event) {
        const touch = event.changedTouches[0];
        x = touch.clientX;
        y = touch.clientY;

        node.dispatchEvent(
          new CustomEvent('panend', {
            detail: { x, y },
          })
        );
        window.removeEventListener('touchmove', handleTouchmove);
        window.removeEventListener('touchend', handleTouchend);
      }
      node.addEventListener('mousedown', handleMousedown);
      node.addEventListener('touchstart', handleTouchStart);
      return {
        destroy() {
          node.removeEventListener('mousedown', handleMousedown);
          node.removeEventListener('touchstart', handleTouchStart);
        },
      };
    }

    const scripts = [
      {
        name: 'pdfjsLib',
        src: 'https://unpkg.com/pdfjs-dist@2.3.200/build/pdf.min.js',
      },
      {
        name: 'PDFLib',
        src: 'https://unpkg.com/pdf-lib@1.4.0/dist/pdf-lib.min.js',
      },
      {
        name: 'download',
        src: 'https://unpkg.com/downloadjs@1.4.7',
      },
      { name: 'makeTextPDF', src: 'makeTextPDF.js' },
    ];

    const assets = {};
    function getAsset(name) {
      if (assets[name]) return assets[name];
      const script = scripts.find((s) => s.name === name);
      if (!script) throw new Error(`Script ${name} not exists.`);
      return prepareAsset(script);
    }

    function prepareAsset({ name, src }) {
      if (assets[name]) return assets[name];
      assets[name] = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          resolve(window[name]);
          console.log(`${name} is loaded.`);
        };
        script.onerror = () => {
          reject(`The script ${name} didn't load correctly.`);
          alert(`Some scripts did not load correctly. Please reload and try again.`);
        };
        document.body.appendChild(script);
      });
      return assets[name];
    }

    function prepareAssets() {
      scripts.forEach(prepareAsset);
    }

    // out of the box fonts
    const fonts = {
      Courier: {
        correction(size, lineHeight) {
          return (size * lineHeight - size) / 2 + size / 6;
        },
      },
      Helvetica: {
        correction(size, lineHeight) {
          return (size * lineHeight - size) / 2 + size / 10;
        },
      },
      'Times-Roman': {
        correction(size, lineHeight) {
          return (size * lineHeight - size) / 2 + size / 7;
        },
      },
    };
    // Available fonts
    const Fonts = {
      ...fonts,
      標楷體: {
        src: '/CK.ttf', // 9.9 MB
        correction(size, lineHeight) {
          return (size * lineHeight - size) / 2;
        },
      },
    };

    function fetchFont(name) {
      if (fonts[name]) return fonts[name];
      const font = Fonts[name];
      if (!font) throw new Error(`Font '${name}' not exists.`);
      fonts[name] = fetch(font.src)
        .then((r) => r.arrayBuffer())
        .then((fontBuffer) => {
          const fontFace = new FontFace(name, fontBuffer);
          fontFace.display = 'swap';
          fontFace.load().then(() => document.fonts.add(fontFace));
          return {
            ...font,
            buffer: fontBuffer,
          };
        });
      return fonts[name];
    }

    function readAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }

    function readAsImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        if (src instanceof Blob) {
          const url = window.URL.createObjectURL(src);
          img.src = url;
        } else {
          img.src = src;
        }
      });
    }

    function readAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    async function readAsPDF(file) {
      const pdfjsLib = await getAsset('pdfjsLib');
      // Safari possibly get webkitblobresource error 1 when using origin file blob
      const blob = new Blob([file]);
      const url = window.URL.createObjectURL(blob);
      return pdfjsLib.getDocument(url).promise;
    }

    /* src\Image.svelte generated by Svelte v3.46.1 */
    const file_1 = "src\\Image.svelte";

    function create_fragment$2(ctx) {
    	let div10;
    	let div8;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let pannable_action;
    	let t7;
    	let div9;
    	let img;
    	let img_src_value;
    	let t8;
    	let canvas_1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div9 = element("div");
    			img = element("img");
    			t8 = space();
    			canvas_1 = element("canvas");
    			attr_dev(div0, "data-direction", "left");
    			attr_dev(div0, "class", "resize-border h-full w-1 left-0 top-0 border-l cursor-ew-resize svelte-i6z4ik");
    			add_location(div0, file_1, 144, 4, 3405);
    			attr_dev(div1, "data-direction", "top");
    			attr_dev(div1, "class", "resize-border w-full h-1 left-0 top-0 border-t cursor-ns-resize svelte-i6z4ik");
    			add_location(div1, file_1, 147, 4, 3523);
    			attr_dev(div2, "data-direction", "bottom");
    			attr_dev(div2, "class", "resize-border w-full h-1 left-0 bottom-0 border-b cursor-ns-resize svelte-i6z4ik");
    			add_location(div2, file_1, 150, 4, 3640);
    			attr_dev(div3, "data-direction", "right");
    			attr_dev(div3, "class", "resize-border h-full w-1 right-0 top-0 border-r cursor-ew-resize svelte-i6z4ik");
    			add_location(div3, file_1, 153, 4, 3763);
    			attr_dev(div4, "data-direction", "left-top");
    			attr_dev(div4, "class", "resize-corner left-0 top-0 cursor-nwse-resize transform -translate-x-1/2 -translate-y-1/2 md:scale-25 svelte-i6z4ik");
    			add_location(div4, file_1, 156, 4, 3883);
    			attr_dev(div5, "data-direction", "right-top");
    			attr_dev(div5, "class", "resize-corner right-0 top-0 cursor-nesw-resize transform translate-x-1/2 -translate-y-1/2 md:scale-25 svelte-i6z4ik");
    			add_location(div5, file_1, 160, 4, 4049);
    			attr_dev(div6, "data-direction", "left-bottom");
    			attr_dev(div6, "class", "resize-corner left-0 bottom-0 cursor-nesw-resize transform -translate-x-1/2 translate-y-1/2 md:scale-25 svelte-i6z4ik");
    			add_location(div6, file_1, 164, 4, 4216);
    			attr_dev(div7, "data-direction", "right-bottom");
    			attr_dev(div7, "class", "resize-corner right-0 bottom-0 cursor-nwse-resize transform translate-x-1/2 translate-y-1/2 md:scale-25 svelte-i6z4ik");
    			add_location(div7, file_1, 168, 4, 4387);
    			attr_dev(div8, "class", "absolute w-full h-full cursor-grab svelte-i6z4ik");
    			toggle_class(div8, "cursor-grabbing", /*operation*/ ctx[5] === 'move');
    			toggle_class(div8, "operation", /*operation*/ ctx[5]);
    			add_location(div8, file_1, 136, 2, 3169);
    			attr_dev(img, "class", "w-full h-full");
    			if (!src_url_equal(img.src, img_src_value = "delete.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "delete object");
    			add_location(img, file_1, 177, 4, 4739);
    			attr_dev(div9, "class", "absolute left-0 top-0 right-0 w-12 h-12 m-auto rounded-full bg-white cursor-pointer transform -translate-y-1/2 md:scale-25");
    			add_location(div9, file_1, 173, 2, 4566);
    			attr_dev(canvas_1, "class", "w-full h-full");
    			add_location(canvas_1, file_1, 179, 2, 4818);
    			attr_dev(div10, "class", "absolute left-0 top-0 select-none");
    			set_style(div10, "width", /*width*/ ctx[0] + /*dw*/ ctx[8] + "px");
    			set_style(div10, "height", /*height*/ ctx[1] + /*dh*/ ctx[9] + "px");
    			set_style(div10, "transform", "translate(" + (/*x*/ ctx[2] + /*dx*/ ctx[6]) + "px, " + (/*y*/ ctx[3] + /*dy*/ ctx[7]) + "px)");
    			add_location(div10, file_1, 131, 0, 3010);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div8);
    			append_dev(div8, div0);
    			append_dev(div8, t0);
    			append_dev(div8, div1);
    			append_dev(div8, t1);
    			append_dev(div8, div2);
    			append_dev(div8, t2);
    			append_dev(div8, div3);
    			append_dev(div8, t3);
    			append_dev(div8, div4);
    			append_dev(div8, t4);
    			append_dev(div8, div5);
    			append_dev(div8, t5);
    			append_dev(div8, div6);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div10, t7);
    			append_dev(div10, div9);
    			append_dev(div9, img);
    			append_dev(div10, t8);
    			append_dev(div10, canvas_1);
    			/*canvas_1_binding*/ ctx[17](canvas_1);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(pannable_action = pannable.call(null, div8)),
    					listen_dev(div8, "panstart", /*handlePanStart*/ ctx[12], false, false, false),
    					listen_dev(div8, "panmove", /*handlePanMove*/ ctx[10], false, false, false),
    					listen_dev(div8, "panend", /*handlePanEnd*/ ctx[11], false, false, false),
    					listen_dev(div9, "click", /*onDelete*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*operation*/ 32) {
    				toggle_class(div8, "cursor-grabbing", /*operation*/ ctx[5] === 'move');
    			}

    			if (dirty & /*operation*/ 32) {
    				toggle_class(div8, "operation", /*operation*/ ctx[5]);
    			}

    			if (dirty & /*width, dw*/ 257) {
    				set_style(div10, "width", /*width*/ ctx[0] + /*dw*/ ctx[8] + "px");
    			}

    			if (dirty & /*height, dh*/ 514) {
    				set_style(div10, "height", /*height*/ ctx[1] + /*dh*/ ctx[9] + "px");
    			}

    			if (dirty & /*x, dx, y, dy*/ 204) {
    				set_style(div10, "transform", "translate(" + (/*x*/ ctx[2] + /*dx*/ ctx[6]) + "px, " + (/*y*/ ctx[3] + /*dy*/ ctx[7]) + "px)");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			/*canvas_1_binding*/ ctx[17](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { payload } = $$props;
    	let { file } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let { pageScale = 1 } = $$props;
    	const dispatch = createEventDispatcher();
    	let startX;
    	let startY;
    	let canvas;
    	let operation = "";
    	let directions = [];
    	let dx = 0;
    	let dy = 0;
    	let dw = 0;
    	let dh = 0;

    	async function render() {
    		// use canvas to prevent img tag's auto resize
    		$$invalidate(4, canvas.width = width, canvas);

    		$$invalidate(4, canvas.height = height, canvas);
    		canvas.getContext("2d").drawImage(payload, 0, 0);
    		let scale = 1;
    		const limit = 500;

    		if (width > limit) {
    			scale = limit / width;
    		}

    		if (height > limit) {
    			scale = Math.min(scale, limit / height);
    		}

    		dispatch("update", {
    			width: width * scale,
    			height: height * scale
    		});

    		if (!["image/jpeg", "image/png"].includes(file.type)) {
    			canvas.toBlob(blob => {
    				dispatch("update", { file: blob });
    			});
    		}
    	}

    	function handlePanMove(event) {
    		const _dx = (event.detail.x - startX) / pageScale;
    		const _dy = (event.detail.y - startY) / pageScale;

    		if (operation === "move") {
    			$$invalidate(6, dx = _dx);
    			$$invalidate(7, dy = _dy);
    		} else if (operation === "scale") {
    			if (directions.includes("left")) {
    				$$invalidate(6, dx = _dx);
    				$$invalidate(8, dw = -_dx);
    			}

    			if (directions.includes("top")) {
    				$$invalidate(7, dy = _dy);
    				$$invalidate(9, dh = -_dy);
    			}

    			if (directions.includes("right")) {
    				$$invalidate(8, dw = _dx);
    			}

    			if (directions.includes("bottom")) {
    				$$invalidate(9, dh = _dy);
    			}
    		}
    	}

    	function handlePanEnd(event) {
    		if (operation === "move") {
    			dispatch("update", { x: x + dx, y: y + dy });
    			$$invalidate(6, dx = 0);
    			$$invalidate(7, dy = 0);
    		} else if (operation === "scale") {
    			dispatch("update", {
    				x: x + dx,
    				y: y + dy,
    				width: width + dw,
    				height: height + dh
    			});

    			$$invalidate(6, dx = 0);
    			$$invalidate(7, dy = 0);
    			$$invalidate(8, dw = 0);
    			$$invalidate(9, dh = 0);
    			directions = [];
    		}

    		$$invalidate(5, operation = "");
    	}

    	function handlePanStart(event) {
    		startX = event.detail.x;
    		startY = event.detail.y;

    		if (event.detail.target === event.currentTarget) {
    			return $$invalidate(5, operation = "move");
    		}

    		$$invalidate(5, operation = "scale");
    		directions = event.detail.target.dataset.direction.split("-");
    	}

    	function onDelete() {
    		dispatch("delete");
    	}

    	onMount(render);
    	const writable_props = ['payload', 'file', 'width', 'height', 'x', 'y', 'pageScale'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(4, canvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('payload' in $$props) $$invalidate(14, payload = $$props.payload);
    		if ('file' in $$props) $$invalidate(15, file = $$props.file);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    		if ('pageScale' in $$props) $$invalidate(16, pageScale = $$props.pageScale);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		pannable,
    		readAsArrayBuffer,
    		payload,
    		file,
    		width,
    		height,
    		x,
    		y,
    		pageScale,
    		dispatch,
    		startX,
    		startY,
    		canvas,
    		operation,
    		directions,
    		dx,
    		dy,
    		dw,
    		dh,
    		render,
    		handlePanMove,
    		handlePanEnd,
    		handlePanStart,
    		onDelete
    	});

    	$$self.$inject_state = $$props => {
    		if ('payload' in $$props) $$invalidate(14, payload = $$props.payload);
    		if ('file' in $$props) $$invalidate(15, file = $$props.file);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    		if ('pageScale' in $$props) $$invalidate(16, pageScale = $$props.pageScale);
    		if ('startX' in $$props) startX = $$props.startX;
    		if ('startY' in $$props) startY = $$props.startY;
    		if ('canvas' in $$props) $$invalidate(4, canvas = $$props.canvas);
    		if ('operation' in $$props) $$invalidate(5, operation = $$props.operation);
    		if ('directions' in $$props) directions = $$props.directions;
    		if ('dx' in $$props) $$invalidate(6, dx = $$props.dx);
    		if ('dy' in $$props) $$invalidate(7, dy = $$props.dy);
    		if ('dw' in $$props) $$invalidate(8, dw = $$props.dw);
    		if ('dh' in $$props) $$invalidate(9, dh = $$props.dh);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		height,
    		x,
    		y,
    		canvas,
    		operation,
    		dx,
    		dy,
    		dw,
    		dh,
    		handlePanMove,
    		handlePanEnd,
    		handlePanStart,
    		onDelete,
    		payload,
    		file,
    		pageScale,
    		canvas_1_binding
    	];
    }

    class Image$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, not_equal, {
    			payload: 14,
    			file: 15,
    			width: 0,
    			height: 1,
    			x: 2,
    			y: 3,
    			pageScale: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*payload*/ ctx[14] === undefined && !('payload' in props)) {
    			console.warn("<Image> was created without expected prop 'payload'");
    		}

    		if (/*file*/ ctx[15] === undefined && !('file' in props)) {
    			console.warn("<Image> was created without expected prop 'file'");
    		}

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console.warn("<Image> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console.warn("<Image> was created without expected prop 'height'");
    		}

    		if (/*x*/ ctx[2] === undefined && !('x' in props)) {
    			console.warn("<Image> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[3] === undefined && !('y' in props)) {
    			console.warn("<Image> was created without expected prop 'y'");
    		}
    	}

    	get payload() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set payload(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get file() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageScale() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageScale(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Portal.svelte generated by Svelte v3.46.1 */

    const file$1 = "src\\Portal.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$1, 5, 0, 84);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[3](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[3](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Portal', slots, ['default']);
    	let portal;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Portal> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			portal = $$value;
    			$$invalidate(0, portal);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ portal });

    	$$self.$inject_state = $$props => {
    		if ('portal' in $$props) $$invalidate(0, portal = $$props.portal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*portal*/ 1) {
    			 portal && document.body.appendChild(portal);
    		}
    	};

    	return [portal, $$scope, slots, div_binding];
    }

    class Portal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Portal",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Toolbar.svelte generated by Svelte v3.46.1 */
    const file$2 = "src\\Toolbar.svelte";

    // (5:0) <Portal>
    function create_default_slot(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[0].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "fixed z-10 top-0 left-0 right-0 h-12");
    			add_location(div, file$2, 5, 2, 71);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(5:0) <Portal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let portal;
    	let current;

    	portal = new Portal({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(portal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(portal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const portal_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				portal_changes.$$scope = { dirty, ctx };
    			}

    			portal.$set(portal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(portal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(portal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(portal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toolbar', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toolbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Portal });
    	return [slots, $$scope];
    }

    class Toolbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toolbar",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    function tapout(node) {
      function handleTouchstart(event) {
        if (!Array.from(event.touches).some((touch) => node.contains(touch.target)))
          node.dispatchEvent(new CustomEvent('tapout'));
      }
      function handleMousedown(event) {
        if (!node.contains(event.target)) {
          node.dispatchEvent(new CustomEvent('tapout'));
        }
      }
      window.addEventListener('touchstart', handleTouchstart);
      window.addEventListener('mousedown', handleMousedown);
      return {
        destroy() {
          window.removeEventListener('touchstart', handleTouchstart);
          window.removeEventListener('mousedown', handleMousedown);
        },
      };
    }

    function ggID() {
      let id = 0;
      return function genId() {
        return id++;
      };
    }
    function timeout(ms) {
      return new Promise((res) => setTimeout(res, ms));
    }
    const noop$1 = () => {};

    /* src\Text.svelte generated by Svelte v3.46.1 */

    const { Object: Object_1 } = globals;
    const file$3 = "src\\Text.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (182:0) {#if operation}
    function create_if_block(ctx) {
    	let toolbar;
    	let current;

    	toolbar = new Toolbar({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toolbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toolbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toolbar_changes = {};

    			if (dirty[0] & /*_fontFamily, _size, _lineHeight*/ 56 | dirty[1] & /*$$scope*/ 256) {
    				toolbar_changes.$$scope = { dirty, ctx };
    			}

    			toolbar.$set(toolbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toolbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toolbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toolbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(182:0) {#if operation}",
    		ctx
    	});

    	return block;
    }

    // (218:12) {#each Families as family}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*family*/ ctx[36] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*family*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file$3, 218, 14, 5996);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(218:12) {#each Families as family}",
    		ctx
    	});

    	return block;
    }

    // (183:2) <Toolbar>
    function create_default_slot$1(ctx) {
    	let div6;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let input0;
    	let t1;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t2;
    	let input1;
    	let t3;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t4;
    	let div3;
    	let select;
    	let t5;
    	let div2;
    	let svg;
    	let path;
    	let t6;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let tapout_action;
    	let mounted;
    	let dispose;
    	let each_value = /*Families*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			input0 = element("input");
    			t1 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			div4 = element("div");
    			img2 = element("img");
    			t4 = space();
    			div3 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div2 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t6 = space();
    			div5 = element("div");
    			img3 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "line_height.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "w-6 mr-2");
    			attr_dev(img0, "alt", "Line height");
    			add_location(img0, file$3, 191, 8, 5065);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "1");
    			attr_dev(input0, "max", "10");
    			attr_dev(input0, "step", "0.1");
    			attr_dev(input0, "class", "h-6 w-12 text-center flex-shrink-0 rounded-sm");
    			add_location(input0, file$3, 192, 8, 5139);
    			attr_dev(div0, "class", "mr-2 flex items-center");
    			add_location(div0, file$3, 190, 6, 5020);
    			if (!src_url_equal(img1.src, img1_src_value = "text.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "w-6 mr-2");
    			attr_dev(img1, "alt", "Font size");
    			add_location(img1, file$3, 201, 8, 5394);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "12");
    			attr_dev(input1, "max", "120");
    			attr_dev(input1, "step", "1");
    			attr_dev(input1, "class", "h-6 w-12 text-center flex-shrink-0 rounded-sm");
    			add_location(input1, file$3, 202, 8, 5459);
    			attr_dev(div1, "class", "mr-2 flex items-center");
    			add_location(div1, file$3, 200, 6, 5349);
    			if (!src_url_equal(img2.src, img2_src_value = "text-family.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "w-4 mr-2");
    			attr_dev(img2, "alt", "Font family");
    			add_location(img2, file$3, 211, 8, 5708);
    			attr_dev(select, "class", "font-family svelte-14i4sqe");
    			if (/*_fontFamily*/ ctx[5] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[28].call(select));
    			add_location(select, file$3, 213, 10, 5828);
    			attr_dev(path, "d", "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757\n                6.586 4.343 8z");
    			add_location(path, file$3, 228, 14, 6367);
    			attr_dev(svg, "class", "fill-current h-4 w-4");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			add_location(svg, file$3, 224, 12, 6221);
    			attr_dev(div2, "class", "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700");
    			add_location(div2, file$3, 221, 10, 6087);
    			attr_dev(div3, "class", "relative w-32 md:w-40");
    			add_location(div3, file$3, 212, 8, 5782);
    			attr_dev(div4, "class", "mr-2 flex items-center");
    			add_location(div4, file$3, 210, 6, 5663);
    			attr_dev(img3, "class", "w-full h-full");
    			if (!src_url_equal(img3.src, img3_src_value = "delete.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "delete object");
    			add_location(img3, file$3, 238, 8, 6660);
    			attr_dev(div5, "class", "w-5 h-5 rounded-full bg-white cursor-pointer");
    			add_location(div5, file$3, 235, 6, 6557);
    			attr_dev(div6, "class", "h-full flex justify-center items-center bg-gray-300 border-b border-gray-400");
    			add_location(div6, file$3, 183, 4, 4798);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*_lineHeight*/ ctx[4]);
    			append_dev(div6, t1);
    			append_dev(div6, div1);
    			append_dev(div1, img1);
    			append_dev(div1, t2);
    			append_dev(div1, input1);
    			set_input_value(input1, /*_size*/ ctx[3]);
    			append_dev(div6, t3);
    			append_dev(div6, div4);
    			append_dev(div4, img2);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*_fontFamily*/ ctx[5]);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, svg);
    			append_dev(svg, path);
    			append_dev(div6, t6);
    			append_dev(div6, div5);
    			append_dev(div5, img3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[26]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[27]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[28]),
    					listen_dev(select, "change", /*onChangeFont*/ ctx[19], false, false, false),
    					listen_dev(div5, "click", /*onDelete*/ ctx[20], false, false, false),
    					action_destroyer(tapout_action = tapout.call(null, div6)),
    					listen_dev(div6, "tapout", /*onBlurTool*/ ctx[18], false, false, false),
    					listen_dev(div6, "mousedown", /*onFocusTool*/ ctx[17], false, false, false),
    					listen_dev(div6, "touchstart", /*onFocusTool*/ ctx[17], { passive: true }, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*_lineHeight*/ 16 && to_number(input0.value) !== /*_lineHeight*/ ctx[4]) {
    				set_input_value(input0, /*_lineHeight*/ ctx[4]);
    			}

    			if (dirty[0] & /*_size*/ 8 && to_number(input1.value) !== /*_size*/ ctx[3]) {
    				set_input_value(input1, /*_size*/ ctx[3]);
    			}

    			if (dirty[0] & /*Families*/ 512) {
    				each_value = /*Families*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*_fontFamily, Families*/ 544) {
    				select_option(select, /*_fontFamily*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(183:2) <Toolbar>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let t0;
    	let div2;
    	let div0;
    	let pannable_action;
    	let t1;
    	let div1;
    	let tapout_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*operation*/ ctx[8] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "absolute w-full h-full cursor-grab border border-dotted border-gray-500 svelte-14i4sqe");
    			toggle_class(div0, "cursor-grab", !/*operation*/ ctx[8]);
    			toggle_class(div0, "cursor-grabbing", /*operation*/ ctx[8] === 'move');
    			toggle_class(div0, "editing", ['edit', 'tool'].includes(/*operation*/ ctx[8]));
    			add_location(div0, file$3, 248, 2, 6913);
    			attr_dev(div1, "contenteditable", "true");
    			attr_dev(div1, "spellcheck", "false");
    			attr_dev(div1, "class", "outline-none whitespace-no-wrap");
    			set_style(div1, "font-size", /*_size*/ ctx[3] + "px");
    			set_style(div1, "font-family", "'" + /*_fontFamily*/ ctx[5] + "', serif");
    			set_style(div1, "line-height", /*_lineHeight*/ ctx[4]);
    			set_style(div1, "-webkit-user-select", "text");
    			add_location(div1, file$3, 258, 2, 7262);
    			attr_dev(div2, "class", "absolute left-0 top-0 select-none");
    			set_style(div2, "transform", "translate(" + (/*x*/ ctx[0] + /*dx*/ ctx[6]) + "px, " + (/*y*/ ctx[1] + /*dy*/ ctx[7]) + "px)");
    			add_location(div2, file$3, 243, 0, 6771);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			/*div1_binding*/ ctx[29](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(pannable_action = pannable.call(null, div0)),
    					listen_dev(div0, "panstart", /*handlePanStart*/ ctx[12], false, false, false),
    					listen_dev(div0, "panmove", /*handlePanMove*/ ctx[10], false, false, false),
    					listen_dev(div0, "panend", /*handlePanEnd*/ ctx[11], false, false, false),
    					listen_dev(div1, "focus", /*onFocus*/ ctx[13], false, false, false),
    					listen_dev(div1, "keydown", /*onKeydown*/ ctx[16], false, false, false),
    					listen_dev(div1, "paste", prevent_default(/*onPaste*/ ctx[15]), false, true, false),
    					action_destroyer(tapout_action = tapout.call(null, div2)),
    					listen_dev(div2, "tapout", /*onBlur*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*operation*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*operation*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*operation*/ 256) {
    				toggle_class(div0, "cursor-grab", !/*operation*/ ctx[8]);
    			}

    			if (dirty[0] & /*operation*/ 256) {
    				toggle_class(div0, "cursor-grabbing", /*operation*/ ctx[8] === 'move');
    			}

    			if (dirty[0] & /*operation*/ 256) {
    				toggle_class(div0, "editing", ['edit', 'tool'].includes(/*operation*/ ctx[8]));
    			}

    			if (!current || dirty[0] & /*_size*/ 8) {
    				set_style(div1, "font-size", /*_size*/ ctx[3] + "px");
    			}

    			if (!current || dirty[0] & /*_fontFamily*/ 32) {
    				set_style(div1, "font-family", "'" + /*_fontFamily*/ ctx[5] + "', serif");
    			}

    			if (!current || dirty[0] & /*_lineHeight*/ 16) {
    				set_style(div1, "line-height", /*_lineHeight*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*x, dx, y, dy*/ 195) {
    				set_style(div2, "transform", "translate(" + (/*x*/ ctx[0] + /*dx*/ ctx[6]) + "px, " + (/*y*/ ctx[1] + /*dy*/ ctx[7]) + "px)");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			/*div1_binding*/ ctx[29](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, []);
    	let { size } = $$props;
    	let { text } = $$props;
    	let { lineHeight } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let { fontFamily } = $$props;
    	let { pageScale = 1 } = $$props;
    	const Families = Object.keys(Fonts);
    	const dispatch = createEventDispatcher();
    	let startX;
    	let startY;
    	let editable;
    	let _size = size;
    	let _lineHeight = lineHeight;
    	let _fontFamily = fontFamily;
    	let dx = 0;
    	let dy = 0;
    	let operation = "";

    	function handlePanMove(event) {
    		$$invalidate(6, dx = (event.detail.x - startX) / pageScale);
    		$$invalidate(7, dy = (event.detail.y - startY) / pageScale);
    	}

    	function handlePanEnd(event) {
    		if (dx === 0 && dy === 0) {
    			return editable.focus();
    		}

    		dispatch("update", { x: x + dx, y: y + dy });
    		$$invalidate(6, dx = 0);
    		$$invalidate(7, dy = 0);
    		$$invalidate(8, operation = "");
    	}

    	function handlePanStart(event) {
    		startX = event.detail.x;
    		startY = event.detail.y;
    		$$invalidate(8, operation = "move");
    	}

    	function onFocus() {
    		$$invalidate(8, operation = "edit");
    	}

    	async function onBlur() {
    		if (operation !== "edit" || operation === "tool") return;
    		editable.blur();
    		sanitize();

    		dispatch("update", {
    			lines: extractLines(),
    			width: editable.clientWidth
    		});

    		$$invalidate(8, operation = "");
    	}

    	async function onPaste(e) {
    		// get text only
    		const pastedText = e.clipboardData.getData("text");

    		document.execCommand("insertHTML", false, pastedText);

    		// await tick() is not enough
    		await timeout();

    		sanitize();
    	}

    	function onKeydown(e) {
    		const childNodes = Array.from(editable.childNodes);

    		if (e.keyCode === 13) {
    			// prevent default adding div behavior
    			e.preventDefault();

    			const selection = window.getSelection();
    			const focusNode = selection.focusNode;
    			const focusOffset = selection.focusOffset;

    			// the caret is at an empty line
    			if (focusNode === editable) {
    				editable.insertBefore(document.createElement("br"), childNodes[focusOffset]);
    			} else if (focusNode instanceof HTMLBRElement) {
    				editable.insertBefore(document.createElement("br"), focusNode);
    			} else // the caret is at a text line but not end
    			if (focusNode.textContent.length !== focusOffset) {
    				document.execCommand("insertHTML", false, "<br>");
    			} else {
    				let br = focusNode.nextSibling; // the carat is at the end of a text line

    				if (br) {
    					editable.insertBefore(document.createElement("br"), br);
    				} else {
    					br = editable.appendChild(document.createElement("br"));
    					br = editable.appendChild(document.createElement("br"));
    				}

    				// set selection to new line
    				selection.collapse(br, 0);
    			}
    		}
    	}

    	function onFocusTool() {
    		$$invalidate(8, operation = "tool");
    	}

    	async function onBlurTool() {
    		if (operation !== "tool" || operation === "edit") return;

    		dispatch("update", {
    			lines: extractLines(),
    			lineHeight: _lineHeight,
    			size: _size,
    			fontFamily: _fontFamily
    		});

    		$$invalidate(8, operation = "");
    	}

    	function sanitize() {
    		let weirdNode;

    		while (weirdNode = Array.from(editable.childNodes).find(node => !["#text", "BR"].includes(node.nodeName))) {
    			editable.removeChild(weirdNode);
    		}
    	}

    	function onChangeFont() {
    		dispatch("selectFont", { name: _fontFamily });
    	}

    	function render() {
    		$$invalidate(2, editable.innerHTML = text, editable);
    		editable.focus();
    	}

    	function extractLines() {
    		const nodes = editable.childNodes;
    		const lines = [];
    		let lineText = "";

    		for (let index = 0; index < nodes.length; index++) {
    			const node = nodes[index];

    			if (node.nodeName === "BR") {
    				lines.push(lineText);
    				lineText = "";
    			} else {
    				lineText += node.textContent;
    			}
    		}

    		lines.push(lineText);
    		return lines;
    	}

    	function onDelete() {
    		dispatch("delete");
    	}

    	onMount(render);
    	const writable_props = ['size', 'text', 'lineHeight', 'x', 'y', 'fontFamily', 'pageScale'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		_lineHeight = to_number(this.value);
    		$$invalidate(4, _lineHeight);
    	}

    	function input1_input_handler() {
    		_size = to_number(this.value);
    		$$invalidate(3, _size);
    	}

    	function select_change_handler() {
    		_fontFamily = select_value(this);
    		$$invalidate(5, _fontFamily);
    		$$invalidate(9, Families);
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			editable = $$value;
    			$$invalidate(2, editable);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(21, size = $$props.size);
    		if ('text' in $$props) $$invalidate(22, text = $$props.text);
    		if ('lineHeight' in $$props) $$invalidate(23, lineHeight = $$props.lineHeight);
    		if ('x' in $$props) $$invalidate(0, x = $$props.x);
    		if ('y' in $$props) $$invalidate(1, y = $$props.y);
    		if ('fontFamily' in $$props) $$invalidate(24, fontFamily = $$props.fontFamily);
    		if ('pageScale' in $$props) $$invalidate(25, pageScale = $$props.pageScale);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		Toolbar,
    		pannable,
    		tapout,
    		timeout,
    		Fonts,
    		size,
    		text,
    		lineHeight,
    		x,
    		y,
    		fontFamily,
    		pageScale,
    		Families,
    		dispatch,
    		startX,
    		startY,
    		editable,
    		_size,
    		_lineHeight,
    		_fontFamily,
    		dx,
    		dy,
    		operation,
    		handlePanMove,
    		handlePanEnd,
    		handlePanStart,
    		onFocus,
    		onBlur,
    		onPaste,
    		onKeydown,
    		onFocusTool,
    		onBlurTool,
    		sanitize,
    		onChangeFont,
    		render,
    		extractLines,
    		onDelete
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(21, size = $$props.size);
    		if ('text' in $$props) $$invalidate(22, text = $$props.text);
    		if ('lineHeight' in $$props) $$invalidate(23, lineHeight = $$props.lineHeight);
    		if ('x' in $$props) $$invalidate(0, x = $$props.x);
    		if ('y' in $$props) $$invalidate(1, y = $$props.y);
    		if ('fontFamily' in $$props) $$invalidate(24, fontFamily = $$props.fontFamily);
    		if ('pageScale' in $$props) $$invalidate(25, pageScale = $$props.pageScale);
    		if ('startX' in $$props) startX = $$props.startX;
    		if ('startY' in $$props) startY = $$props.startY;
    		if ('editable' in $$props) $$invalidate(2, editable = $$props.editable);
    		if ('_size' in $$props) $$invalidate(3, _size = $$props._size);
    		if ('_lineHeight' in $$props) $$invalidate(4, _lineHeight = $$props._lineHeight);
    		if ('_fontFamily' in $$props) $$invalidate(5, _fontFamily = $$props._fontFamily);
    		if ('dx' in $$props) $$invalidate(6, dx = $$props.dx);
    		if ('dy' in $$props) $$invalidate(7, dy = $$props.dy);
    		if ('operation' in $$props) $$invalidate(8, operation = $$props.operation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		x,
    		y,
    		editable,
    		_size,
    		_lineHeight,
    		_fontFamily,
    		dx,
    		dy,
    		operation,
    		Families,
    		handlePanMove,
    		handlePanEnd,
    		handlePanStart,
    		onFocus,
    		onBlur,
    		onPaste,
    		onKeydown,
    		onFocusTool,
    		onBlurTool,
    		onChangeFont,
    		onDelete,
    		size,
    		text,
    		lineHeight,
    		fontFamily,
    		pageScale,
    		input0_input_handler,
    		input1_input_handler,
    		select_change_handler,
    		div1_binding
    	];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$5,
    			create_fragment$5,
    			not_equal,
    			{
    				size: 21,
    				text: 22,
    				lineHeight: 23,
    				x: 0,
    				y: 1,
    				fontFamily: 24,
    				pageScale: 25
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[21] === undefined && !('size' in props)) {
    			console.warn("<Text> was created without expected prop 'size'");
    		}

    		if (/*text*/ ctx[22] === undefined && !('text' in props)) {
    			console.warn("<Text> was created without expected prop 'text'");
    		}

    		if (/*lineHeight*/ ctx[23] === undefined && !('lineHeight' in props)) {
    			console.warn("<Text> was created without expected prop 'lineHeight'");
    		}

    		if (/*x*/ ctx[0] === undefined && !('x' in props)) {
    			console.warn("<Text> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[1] === undefined && !('y' in props)) {
    			console.warn("<Text> was created without expected prop 'y'");
    		}

    		if (/*fontFamily*/ ctx[24] === undefined && !('fontFamily' in props)) {
    			console.warn("<Text> was created without expected prop 'fontFamily'");
    		}
    	}

    	get size() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineHeight() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineHeight(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontFamily() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontFamily(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageScale() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageScale(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Drawing.svelte generated by Svelte v3.46.1 */
    const file$4 = "src\\Drawing.svelte";

    function create_fragment$6(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let pannable_action;
    	let t1;
    	let div3;
    	let img;
    	let img_src_value;
    	let t2;
    	let svg_1;
    	let path_1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div3 = element("div");
    			img = element("img");
    			t2 = space();
    			svg_1 = svg_element("svg");
    			path_1 = svg_element("path");
    			attr_dev(div0, "data-direction", "left-top");
    			attr_dev(div0, "class", "absolute left-0 top-0 w-10 h-10 bg-green-400 rounded-full cursor-nwse-resize transform -translate-x-1/2 -translate-y-1/2 md:scale-25");
    			add_location(div0, file$4, 101, 4, 2560);
    			attr_dev(div1, "data-direction", "right-bottom");
    			attr_dev(div1, "class", "absolute right-0 bottom-0 w-10 h-10 bg-green-400 rounded-full cursor-nwse-resize transform translate-x-1/2 translate-y-1/2 md:scale-25");
    			add_location(div1, file$4, 105, 4, 2757);
    			attr_dev(div2, "class", "absolute w-full h-full cursor-grab border border-gray-400 border-dashed svelte-sf1zqb");
    			toggle_class(div2, "cursor-grabbing", /*operation*/ ctx[5] === 'move');
    			toggle_class(div2, "operation", /*operation*/ ctx[5]);
    			add_location(div2, file$4, 92, 2, 2283);
    			attr_dev(img, "class", "w-full h-full");
    			if (!src_url_equal(img.src, img_src_value = "delete.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "delete object");
    			add_location(img, file$4, 114, 4, 3140);
    			attr_dev(div3, "class", "absolute left-0 top-0 right-0 w-12 h-12 m-auto rounded-full bg-white cursor-pointer transform -translate-y-1/2 md:scale-25");
    			add_location(div3, file$4, 110, 2, 2967);
    			attr_dev(path_1, "stroke-width", "5");
    			attr_dev(path_1, "stroke-linejoin", "round");
    			attr_dev(path_1, "stroke-linecap", "round");
    			attr_dev(path_1, "stroke", "black");
    			attr_dev(path_1, "fill", "none");
    			attr_dev(path_1, "d", /*path*/ ctx[3]);
    			add_location(path_1, file$4, 117, 4, 3272);
    			attr_dev(svg_1, "width", "100%");
    			attr_dev(svg_1, "height", "100%");
    			add_location(svg_1, file$4, 116, 2, 3219);
    			attr_dev(div4, "class", "absolute left-0 top-0 select-none");
    			set_style(div4, "width", /*width*/ ctx[0] + /*dw*/ ctx[8] + "px");
    			set_style(div4, "height", (/*width*/ ctx[0] + /*dw*/ ctx[8]) / /*ratio*/ ctx[9] + "px");
    			set_style(div4, "transform", "translate(" + (/*x*/ ctx[1] + /*dx*/ ctx[6]) + "px, " + (/*y*/ ctx[2] + /*dy*/ ctx[7]) + "px)");
    			add_location(div4, file$4, 88, 0, 2116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, img);
    			append_dev(div4, t2);
    			append_dev(div4, svg_1);
    			append_dev(svg_1, path_1);
    			/*svg_1_binding*/ ctx[17](svg_1);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(pannable_action = pannable.call(null, div2)),
    					listen_dev(div2, "panstart", /*handlePanStart*/ ctx[12], false, false, false),
    					listen_dev(div2, "panmove", /*handlePanMove*/ ctx[10], false, false, false),
    					listen_dev(div2, "panend", /*handlePanEnd*/ ctx[11], false, false, false),
    					listen_dev(div3, "click", /*onDelete*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*operation*/ 32) {
    				toggle_class(div2, "cursor-grabbing", /*operation*/ ctx[5] === 'move');
    			}

    			if (dirty & /*operation*/ 32) {
    				toggle_class(div2, "operation", /*operation*/ ctx[5]);
    			}

    			if (dirty & /*path*/ 8) {
    				attr_dev(path_1, "d", /*path*/ ctx[3]);
    			}

    			if (dirty & /*width, dw*/ 257) {
    				set_style(div4, "width", /*width*/ ctx[0] + /*dw*/ ctx[8] + "px");
    			}

    			if (dirty & /*width, dw*/ 257) {
    				set_style(div4, "height", (/*width*/ ctx[0] + /*dw*/ ctx[8]) / /*ratio*/ ctx[9] + "px");
    			}

    			if (dirty & /*x, dx, y, dy*/ 198) {
    				set_style(div4, "transform", "translate(" + (/*x*/ ctx[1] + /*dx*/ ctx[6]) + "px, " + (/*y*/ ctx[2] + /*dy*/ ctx[7]) + "px)");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			/*svg_1_binding*/ ctx[17](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Drawing', slots, []);
    	let { originWidth } = $$props;
    	let { originHeight } = $$props;
    	let { width } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let { pageScale = 1 } = $$props;
    	let { path } = $$props;
    	const dispatch = createEventDispatcher();
    	let startX;
    	let startY;
    	let svg;
    	let operation = "";
    	let dx = 0;
    	let dy = 0;
    	let dw = 0;
    	let direction = "";
    	const ratio = originWidth / originHeight;

    	async function render() {
    		svg.setAttribute("viewBox", `0 0 ${originWidth} ${originHeight}`);
    	}

    	function handlePanMove(event) {
    		const _dx = (event.detail.x - startX) / pageScale;
    		const _dy = (event.detail.y - startY) / pageScale;

    		if (operation === "move") {
    			$$invalidate(6, dx = _dx);
    			$$invalidate(7, dy = _dy);
    		} else if (operation === "scale") {
    			if (direction === "left-top") {
    				let d = Infinity;
    				d = Math.min(_dx, _dy * ratio);
    				$$invalidate(6, dx = d);
    				$$invalidate(8, dw = -d);
    				$$invalidate(7, dy = d / ratio);
    			}

    			if (direction === "right-bottom") {
    				let d = -Infinity;
    				d = Math.max(_dx, _dy * ratio);
    				$$invalidate(8, dw = d);
    			}
    		}
    	}

    	function handlePanEnd(event) {
    		if (operation === "move") {
    			dispatch("update", { x: x + dx, y: y + dy });
    			$$invalidate(6, dx = 0);
    			$$invalidate(7, dy = 0);
    		} else if (operation === "scale") {
    			dispatch("update", {
    				x: x + dx,
    				y: y + dy,
    				width: width + dw,
    				scale: (width + dw) / originWidth
    			});

    			$$invalidate(6, dx = 0);
    			$$invalidate(7, dy = 0);
    			$$invalidate(8, dw = 0);
    			direction = "";
    		}

    		$$invalidate(5, operation = "");
    	}

    	function handlePanStart(event) {
    		startX = event.detail.x;
    		startY = event.detail.y;

    		if (event.detail.target === event.currentTarget) {
    			return $$invalidate(5, operation = "move");
    		}

    		$$invalidate(5, operation = "scale");
    		direction = event.detail.target.dataset.direction;
    	}

    	function onDelete() {
    		dispatch("delete");
    	}

    	onMount(render);
    	const writable_props = ['originWidth', 'originHeight', 'width', 'x', 'y', 'pageScale', 'path'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Drawing> was created with unknown prop '${key}'`);
    	});

    	function svg_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			svg = $$value;
    			$$invalidate(4, svg);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('originWidth' in $$props) $$invalidate(14, originWidth = $$props.originWidth);
    		if ('originHeight' in $$props) $$invalidate(15, originHeight = $$props.originHeight);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('pageScale' in $$props) $$invalidate(16, pageScale = $$props.pageScale);
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		pannable,
    		readAsArrayBuffer,
    		originWidth,
    		originHeight,
    		width,
    		x,
    		y,
    		pageScale,
    		path,
    		dispatch,
    		startX,
    		startY,
    		svg,
    		operation,
    		dx,
    		dy,
    		dw,
    		direction,
    		ratio,
    		render,
    		handlePanMove,
    		handlePanEnd,
    		handlePanStart,
    		onDelete
    	});

    	$$self.$inject_state = $$props => {
    		if ('originWidth' in $$props) $$invalidate(14, originWidth = $$props.originWidth);
    		if ('originHeight' in $$props) $$invalidate(15, originHeight = $$props.originHeight);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('pageScale' in $$props) $$invalidate(16, pageScale = $$props.pageScale);
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('startX' in $$props) startX = $$props.startX;
    		if ('startY' in $$props) startY = $$props.startY;
    		if ('svg' in $$props) $$invalidate(4, svg = $$props.svg);
    		if ('operation' in $$props) $$invalidate(5, operation = $$props.operation);
    		if ('dx' in $$props) $$invalidate(6, dx = $$props.dx);
    		if ('dy' in $$props) $$invalidate(7, dy = $$props.dy);
    		if ('dw' in $$props) $$invalidate(8, dw = $$props.dw);
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		x,
    		y,
    		path,
    		svg,
    		operation,
    		dx,
    		dy,
    		dw,
    		ratio,
    		handlePanMove,
    		handlePanEnd,
    		handlePanStart,
    		onDelete,
    		originWidth,
    		originHeight,
    		pageScale,
    		svg_1_binding
    	];
    }

    class Drawing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, not_equal, {
    			originWidth: 14,
    			originHeight: 15,
    			width: 0,
    			x: 1,
    			y: 2,
    			pageScale: 16,
    			path: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Drawing",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*originWidth*/ ctx[14] === undefined && !('originWidth' in props)) {
    			console.warn("<Drawing> was created without expected prop 'originWidth'");
    		}

    		if (/*originHeight*/ ctx[15] === undefined && !('originHeight' in props)) {
    			console.warn("<Drawing> was created without expected prop 'originHeight'");
    		}

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console.warn("<Drawing> was created without expected prop 'width'");
    		}

    		if (/*x*/ ctx[1] === undefined && !('x' in props)) {
    			console.warn("<Drawing> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[2] === undefined && !('y' in props)) {
    			console.warn("<Drawing> was created without expected prop 'y'");
    		}

    		if (/*path*/ ctx[3] === undefined && !('path' in props)) {
    			console.warn("<Drawing> was created without expected prop 'path'");
    		}
    	}

    	get originWidth() {
    		throw new Error("<Drawing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set originWidth(value) {
    		throw new Error("<Drawing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get originHeight() {
    		throw new Error("<Drawing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set originHeight(value) {
    		throw new Error("<Drawing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Drawing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Drawing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Drawing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Drawing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Drawing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Drawing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageScale() {
    		throw new Error("<Drawing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageScale(value) {
    		throw new Error("<Drawing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get path() {
    		throw new Error("<Drawing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Drawing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\DrawingCanvas.svelte generated by Svelte v3.46.1 */
    const file$5 = "src\\DrawingCanvas.svelte";

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let svg;
    	let path_1;
    	let pannable_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Batal";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Selesai";
    			t3 = space();
    			svg = svg_element("svg");
    			path_1 = svg_element("path");
    			attr_dev(button0, "class", "w-24 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded mr-4");
    			add_location(button0, file$5, 69, 4, 1723);
    			attr_dev(button1, "class", "w-24 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded");
    			add_location(button1, file$5, 75, 4, 1884);
    			attr_dev(div0, "class", "absolute right-0 bottom-0 mr-4 mb-4 flex");
    			add_location(div0, file$5, 68, 2, 1664);
    			attr_dev(path_1, "stroke-width", "5");
    			attr_dev(path_1, "stroke-linejoin", "round");
    			attr_dev(path_1, "stroke-linecap", "round");
    			attr_dev(path_1, "d", /*path*/ ctx[1]);
    			attr_dev(path_1, "stroke", "black");
    			attr_dev(path_1, "fill", "none");
    			add_location(path_1, file$5, 83, 4, 2102);
    			attr_dev(svg, "class", "w-full h-full pointer-events-none");
    			add_location(svg, file$5, 82, 2, 2050);
    			attr_dev(div1, "class", "relative w-full h-full select-none");
    			add_location(div1, file$5, 61, 0, 1488);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div1, t3);
    			append_dev(div1, svg);
    			append_dev(svg, path_1);
    			/*div1_binding*/ ctx[7](div1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*cancel*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*finish*/ ctx[5], false, false, false),
    					action_destroyer(pannable_action = pannable.call(null, div1)),
    					listen_dev(div1, "panstart", /*handlePanStart*/ ctx[2], false, false, false),
    					listen_dev(div1, "panmove", /*handlePanMove*/ ctx[3], false, false, false),
    					listen_dev(div1, "panend", /*handlePanEnd*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*path*/ 2) {
    				attr_dev(path_1, "d", /*path*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*div1_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DrawingCanvas', slots, []);
    	const dispatch = createEventDispatcher();
    	let canvas;
    	let x = 0;
    	let y = 0;
    	let path = "";
    	let minX = Infinity;
    	let maxX = 0;
    	let minY = Infinity;
    	let maxY = 0;
    	let paths = [];
    	let drawing = false;

    	function handlePanStart(event) {
    		if (event.detail.target !== canvas) {
    			return drawing = false;
    		}

    		drawing = true;
    		x = event.detail.x;
    		y = event.detail.y;
    		minX = Math.min(minX, x);
    		maxX = Math.max(maxX, x);
    		minY = Math.min(minY, y);
    		maxY = Math.max(maxY, y);
    		paths.push(["M", x, y]);
    		$$invalidate(1, path += `M${x},${y}`);
    	}

    	function handlePanMove(event) {
    		if (!drawing) return;
    		x = event.detail.x;
    		y = event.detail.y;
    		minX = Math.min(minX, x);
    		maxX = Math.max(maxX, x);
    		minY = Math.min(minY, y);
    		maxY = Math.max(maxY, y);
    		paths.push(["L", x, y]);
    		$$invalidate(1, path += `L${x},${y}`);
    	}

    	function handlePanEnd() {
    		drawing = false;
    	}

    	function finish() {
    		if (!paths.length) return;
    		const dx = -(minX - 10);
    		const dy = -(minY - 10);
    		const width = maxX - minX + 20;
    		const height = maxY - minY + 20;

    		dispatch("finish", {
    			originWidth: width,
    			originHeight: height,
    			path: paths.reduce(
    				(acc, cur) => {
    					return acc + cur[0] + (cur[1] + dx) + "," + (cur[2] + dy);
    				},
    				""
    			)
    		});
    	}

    	function cancel() {
    		dispatch("cancel");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DrawingCanvas> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(0, canvas);
    		});
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		pannable,
    		dispatch,
    		canvas,
    		x,
    		y,
    		path,
    		minX,
    		maxX,
    		minY,
    		maxY,
    		paths,
    		drawing,
    		handlePanStart,
    		handlePanMove,
    		handlePanEnd,
    		finish,
    		cancel
    	});

    	$$self.$inject_state = $$props => {
    		if ('canvas' in $$props) $$invalidate(0, canvas = $$props.canvas);
    		if ('x' in $$props) x = $$props.x;
    		if ('y' in $$props) y = $$props.y;
    		if ('path' in $$props) $$invalidate(1, path = $$props.path);
    		if ('minX' in $$props) minX = $$props.minX;
    		if ('maxX' in $$props) maxX = $$props.maxX;
    		if ('minY' in $$props) minY = $$props.minY;
    		if ('maxY' in $$props) maxY = $$props.maxY;
    		if ('paths' in $$props) paths = $$props.paths;
    		if ('drawing' in $$props) drawing = $$props.drawing;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		canvas,
    		path,
    		handlePanStart,
    		handlePanMove,
    		handlePanEnd,
    		finish,
    		cancel,
    		div1_binding
    	];
    }

    class DrawingCanvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DrawingCanvas",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    async function save(pdfFile, objects, name) {
      const PDFLib = await getAsset('PDFLib');
      const download = await getAsset('download');
      const makeTextPDF = await getAsset('makeTextPDF');
      let pdfDoc;
      try {
        pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(pdfFile));
      } catch (e) {
        console.log('Failed to load PDF.');
        throw e;
      }
      const pagesProcesses = pdfDoc.getPages().map(async (page, pageIndex) => {
        const pageObjects = objects[pageIndex];
        // 'y' starts from bottom in PDFLib, use this to calculate y
        const pageHeight = page.getHeight();
        const embedProcesses = pageObjects.map(async (object) => {
          if (object.type === 'image') {
            let { file, x, y, width, height } = object;
            let img;
            try {
              if (file.type === 'image/jpeg') {
                img = await pdfDoc.embedJpg(await readAsArrayBuffer(file));
              } else {
                img = await pdfDoc.embedPng(await readAsArrayBuffer(file));
              }
              return () =>
                page.drawImage(img, {
                  x,
                  y: pageHeight - y - height,
                  width,
                  height,
                });
            } catch (e) {
              console.log('Failed to embed image.', e);
              return noop$1;
            }
          } else if (object.type === 'text') {
            let { x, y, lines, lineHeight, size, fontFamily, width } = object;
            const height = size * lineHeight * lines.length;
            const font = await fetchFont(fontFamily);
            const [textPage] = await pdfDoc.embedPdf(
              await makeTextPDF({
                lines,
                fontSize: size,
                lineHeight,
                width,
                height,
                font: font.buffer || fontFamily, // built-in font family
                dy: font.correction(size, lineHeight),
              }),
            );
            return () =>
              page.drawPage(textPage, {
                width,
                height,
                x,
                y: pageHeight - y - height,
              });
          } else if (object.type === 'drawing') {
            let { x, y, path, scale } = object;
            const {
              pushGraphicsState,
              setLineCap,
              popGraphicsState,
              setLineJoin,
              LineCapStyle,
              LineJoinStyle,
            } = PDFLib;
            return () => {
              page.pushOperators(
                pushGraphicsState(),
                setLineCap(LineCapStyle.Round),
                setLineJoin(LineJoinStyle.Round),
              );
              page.drawSvgPath(path, {
                borderWidth: 5,
                scale,
                x,
                y: pageHeight - y,
              });
              page.pushOperators(popGraphicsState());
            };
          }
        });
        // embed objects in order
        const drawProcesses = await Promise.all(embedProcesses);
        drawProcesses.forEach((p) => p());
      });
      await Promise.all(pagesProcesses);
      try {
        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, name, 'application/pdf');
      } catch (e) {
        console.log('Failed to save PDF.');
        throw e;
      }
    }

    /* src\App.svelte generated by Svelte v3.46.1 */

    const { console: console_1 } = globals;
    const file$6 = "src\\App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[43] = list[i];
    	return child_ctx;
    }

    // (272:2) {#if addingDrawing}
    function create_if_block_4(ctx) {
    	let div;
    	let drawingcanvas;
    	let div_transition;
    	let current;
    	drawingcanvas = new DrawingCanvas({ $$inline: true });
    	drawingcanvas.$on("finish", /*finish_handler*/ ctx[22]);
    	drawingcanvas.$on("cancel", /*cancel_handler*/ ctx[23]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(drawingcanvas.$$.fragment);
    			attr_dev(div, "class", "fixed z-10 top-0 left-0 right-0 border-b border-gray-300 bg-white shadow-lg");
    			set_style(div, "height", "50%");
    			add_location(div, file$6, 272, 4, 7836);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(drawingcanvas, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(drawingcanvas.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: -200, duration: 500 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(drawingcanvas.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: -200, duration: 500 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(drawingcanvas);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(272:2) {#if addingDrawing}",
    		ctx
    	});

    	return block;
    }

    // (358:2) {:else}
    function create_else_block(ctx) {
    	let div;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Letakan File PDF Di Sini";
    			attr_dev(span, "class", "font-bold text-3xl text-gray-500");
    			add_location(span, file$6, 359, 6, 11222);
    			attr_dev(div, "class", "w-full flex-grow flex justify-center items-center");
    			add_location(div, file$6, 358, 4, 11152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(358:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (291:2) {#if pages.length}
    function create_if_block$1(ctx) {
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let input;
    	let t1;
    	let div1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*pages*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*page*/ ctx[40];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			// if (!src_url_equal(img.src, img_src_value = "edit.svg")) attr_dev(img, "src", img_src_value);
    			// attr_dev(img, "class", "mr-2");
    			// attr_dev(img, "alt", "a pen, edit pdf name");
    			// add_location(img, file$6, 292, 6, 8502);
    			// attr_dev(input, "placeholder", "Ubah nama pdf");
    			// attr_dev(input, "type", "text");
    			attr_dev(input, "class", "flex-grow bg-transparent");
    			// add_location(input, file$6, 293, 6, 8572);
    			attr_dev(div0, "class", "flex justify-center px-5 w-full md:hidden");
    			add_location(div0, file$6, 291, 4, 8440);
    			attr_dev(div1, "class", "w-full");
    			add_location(div1, file$6, 299, 4, 8730);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, input);
    			set_input_value(input, /*pdfName*/ ctx[1]);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[24]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*pdfName*/ 2 && input.value !== /*pdfName*/ ctx[1]) {
    				set_input_value(input, /*pdfName*/ ctx[1]);
    			}

    			if (dirty[0] & /*selectPage, pages, selectedPageIndex, pagesScale, allObjects, updateObject, deleteObject, selectFontFamily, onMeasure*/ 254012) {
    				each_value = /*pages*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(291:2) {#if pages.length}",
    		ctx
    	});

    	return block;
    }

    // (339:52) 
    function create_if_block_3(ctx) {
    	let drawing;
    	let current;

    	function update_handler_2(...args) {
    		return /*update_handler_2*/ ctx[30](/*object*/ ctx[43], ...args);
    	}

    	function delete_handler_2() {
    		return /*delete_handler_2*/ ctx[31](/*object*/ ctx[43]);
    	}

    	drawing = new Drawing({
    			props: {
    				path: /*object*/ ctx[43].path,
    				x: /*object*/ ctx[43].x,
    				y: /*object*/ ctx[43].y,
    				width: /*object*/ ctx[43].width,
    				originWidth: /*object*/ ctx[43].originWidth,
    				originHeight: /*object*/ ctx[43].originHeight,
    				pageScale: /*pagesScale*/ ctx[3][/*pIndex*/ ctx[42]]
    			},
    			$$inline: true
    		});

    	drawing.$on("update", update_handler_2);
    	drawing.$on("delete", delete_handler_2);

    	const block = {
    		c: function create() {
    			create_component(drawing.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(drawing, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const drawing_changes = {};
    			if (dirty[0] & /*allObjects, pages*/ 20) drawing_changes.path = /*object*/ ctx[43].path;
    			if (dirty[0] & /*allObjects, pages*/ 20) drawing_changes.x = /*object*/ ctx[43].x;
    			if (dirty[0] & /*allObjects, pages*/ 20) drawing_changes.y = /*object*/ ctx[43].y;
    			if (dirty[0] & /*allObjects, pages*/ 20) drawing_changes.width = /*object*/ ctx[43].width;
    			if (dirty[0] & /*allObjects, pages*/ 20) drawing_changes.originWidth = /*object*/ ctx[43].originWidth;
    			if (dirty[0] & /*allObjects, pages*/ 20) drawing_changes.originHeight = /*object*/ ctx[43].originHeight;
    			if (dirty[0] & /*pagesScale, pages*/ 12) drawing_changes.pageScale = /*pagesScale*/ ctx[3][/*pIndex*/ ctx[42]];
    			drawing.$set(drawing_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(drawing.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(drawing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(drawing, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(339:52) ",
    		ctx
    	});

    	return block;
    }

    // (327:49) 
    function create_if_block_2(ctx) {
    	let text_1;
    	let current;

    	function update_handler_1(...args) {
    		return /*update_handler_1*/ ctx[28](/*object*/ ctx[43], ...args);
    	}

    	function delete_handler_1() {
    		return /*delete_handler_1*/ ctx[29](/*object*/ ctx[43]);
    	}

    	text_1 = new Text({
    			props: {
    				text: /*object*/ ctx[43].text,
    				x: /*object*/ ctx[43].x,
    				y: /*object*/ ctx[43].y,
    				size: /*object*/ ctx[43].size,
    				lineHeight: /*object*/ ctx[43].lineHeight,
    				fontFamily: /*object*/ ctx[43].fontFamily,
    				pageScale: /*pagesScale*/ ctx[3][/*pIndex*/ ctx[42]]
    			},
    			$$inline: true
    		});

    	text_1.$on("update", update_handler_1);
    	text_1.$on("delete", delete_handler_1);
    	text_1.$on("selectFont", /*selectFontFamily*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const text_1_changes = {};
    			if (dirty[0] & /*allObjects, pages*/ 20) text_1_changes.text = /*object*/ ctx[43].text;
    			if (dirty[0] & /*allObjects, pages*/ 20) text_1_changes.x = /*object*/ ctx[43].x;
    			if (dirty[0] & /*allObjects, pages*/ 20) text_1_changes.y = /*object*/ ctx[43].y;
    			if (dirty[0] & /*allObjects, pages*/ 20) text_1_changes.size = /*object*/ ctx[43].size;
    			if (dirty[0] & /*allObjects, pages*/ 20) text_1_changes.lineHeight = /*object*/ ctx[43].lineHeight;
    			if (dirty[0] & /*allObjects, pages*/ 20) text_1_changes.fontFamily = /*object*/ ctx[43].fontFamily;
    			if (dirty[0] & /*pagesScale, pages*/ 12) text_1_changes.pageScale = /*pagesScale*/ ctx[3][/*pIndex*/ ctx[42]];
    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(327:49) ",
    		ctx
    	});

    	return block;
    }

    // (316:16) {#if object.type === 'image'}
    function create_if_block_1(ctx) {
    	let image;
    	let current;

    	function update_handler(...args) {
    		return /*update_handler*/ ctx[26](/*object*/ ctx[43], ...args);
    	}

    	function delete_handler() {
    		return /*delete_handler*/ ctx[27](/*object*/ ctx[43]);
    	}

    	image = new Image$1({
    			props: {
    				file: /*object*/ ctx[43].file,
    				payload: /*object*/ ctx[43].payload,
    				x: /*object*/ ctx[43].x,
    				y: /*object*/ ctx[43].y,
    				width: /*object*/ ctx[43].width,
    				height: /*object*/ ctx[43].height,
    				pageScale: /*pagesScale*/ ctx[3][/*pIndex*/ ctx[42]]
    			},
    			$$inline: true
    		});

    	image.$on("update", update_handler);
    	image.$on("delete", delete_handler);

    	const block = {
    		c: function create() {
    			create_component(image.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(image, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const image_changes = {};
    			if (dirty[0] & /*allObjects, pages*/ 20) image_changes.file = /*object*/ ctx[43].file;
    			if (dirty[0] & /*allObjects, pages*/ 20) image_changes.payload = /*object*/ ctx[43].payload;
    			if (dirty[0] & /*allObjects, pages*/ 20) image_changes.x = /*object*/ ctx[43].x;
    			if (dirty[0] & /*allObjects, pages*/ 20) image_changes.y = /*object*/ ctx[43].y;
    			if (dirty[0] & /*allObjects, pages*/ 20) image_changes.width = /*object*/ ctx[43].width;
    			if (dirty[0] & /*allObjects, pages*/ 20) image_changes.height = /*object*/ ctx[43].height;
    			if (dirty[0] & /*pagesScale, pages*/ 12) image_changes.pageScale = /*pagesScale*/ ctx[3][/*pIndex*/ ctx[42]];
    			image.$set(image_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(image, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(316:16) {#if object.type === 'image'}",
    		ctx
    	});

    	return block;
    }

    // (315:14) {#each allObjects[pIndex] as object (object.id)}
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*object*/ ctx[43].type === 'image') return 0;
    		if (/*object*/ ctx[43].type === 'text') return 1;
    		if (/*object*/ ctx[43].type === 'drawing') return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(315:14) {#each allObjects[pIndex] as object (object.id)}",
    		ctx
    	});

    	return block;
    }

    // (301:6) {#each pages as page, pIndex (page)}
    function create_each_block$1(key_1, ctx) {
    	let div2;
    	let div1;
    	let pdfpage;
    	let t0;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t1;
    	let current;
    	let mounted;
    	let dispose;

    	function measure_handler(...args) {
    		return /*measure_handler*/ ctx[25](/*pIndex*/ ctx[42], ...args);
    	}

    	pdfpage = new PDFPage({
    			props: { page: /*page*/ ctx[40] },
    			$$inline: true
    		});

    	pdfpage.$on("measure", measure_handler);
    	let each_value_1 = /*allObjects*/ ctx[4][/*pIndex*/ ctx[42]];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*object*/ ctx[43].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	function mousedown_handler() {
    		return /*mousedown_handler*/ ctx[32](/*pIndex*/ ctx[42]);
    	}

    	function touchstart_handler() {
    		return /*touchstart_handler*/ ctx[33](/*pIndex*/ ctx[42]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			create_component(pdfpage.$$.fragment);
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			attr_dev(div0, "class", "absolute top-0 left-0 transform origin-top-left");
    			set_style(div0, "transform", "scale(" + /*pagesScale*/ ctx[3][/*pIndex*/ ctx[42]] + ")");
    			set_style(div0, "touch-action", "none");
    			add_location(div0, file$6, 311, 12, 9223);
    			attr_dev(div1, "class", "relative shadow-lg");
    			toggle_class(div1, "shadow-outline", /*pIndex*/ ctx[42] === /*selectedPageIndex*/ ctx[5]);
    			add_location(div1, file$6, 305, 10, 8991);
    			attr_dev(div2, "class", "p-5 w-full flex flex-col items-center overflow-hidden");
    			add_location(div2, file$6, 301, 8, 8802);
    			this.first = div2;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			mount_component(pdfpage, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "mousedown", mousedown_handler, false, false, false),
    					listen_dev(div2, "touchstart", touchstart_handler, { passive: true }, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const pdfpage_changes = {};
    			if (dirty[0] & /*pages*/ 4) pdfpage_changes.page = /*page*/ ctx[40];
    			pdfpage.$set(pdfpage_changes);

    			if (dirty[0] & /*allObjects, pages, pagesScale, updateObject, deleteObject, selectFontFamily*/ 106524) {
    				each_value_1 = /*allObjects*/ ctx[4][/*pIndex*/ ctx[42]];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div0, outro_and_destroy_block, create_each_block_1, null, get_each_context_1);
    				check_outros();
    			}

    			if (!current || dirty[0] & /*pagesScale, pages*/ 12) {
    				set_style(div0, "transform", "scale(" + /*pagesScale*/ ctx[3][/*pIndex*/ ctx[42]] + ")");
    			}

    			if (dirty[0] & /*pages, selectedPageIndex*/ 36) {
    				toggle_class(div1, "shadow-outline", /*pIndex*/ ctx[42] === /*selectedPageIndex*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pdfpage.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pdfpage.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(pdfpage);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(301:6) {#each pages as page, pIndex (page)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let tailwind;
    	let t0;
    	let main;
    	let div2;
    	let input0;
    	let t1;
    	let input1;
    	let t2;
    	let label0;
    	let t4;
    	let div0;
    	let label1;
    	let img0;
    	let img0_src_value;
    	let t5;
    	let label2;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let label3;
    	let img2;
    	let img2_src_value;
    	let t7;
    	let div1;
    	let img3;
    	let img3_src_value;
    	let t8;
    	let input2;
    	let t9;
    	let button;
    	let t10_value = (/*saving*/ ctx[6] ? 'Saving' : 'Simpan') + "";
    	let t10;
    	let t11;
    	let t12;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let mounted;
    	let dispose;
    	tailwind = new Tailwind({ $$inline: true });
    	let if_block0 = /*addingDrawing*/ ctx[7] && create_if_block_4(ctx);
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*pages*/ ctx[2].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(tailwind.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div2 = element("div");
    			input0 = element("input");
    			t1 = space();
    			input1 = element("input");
    			t2 = space();
    			label0 = element("label");
    			label0.textContent = "Pilih PDF";
    			t4 = space();
    			div0 = element("div");
    			label1 = element("label");
    			img0 = element("img");
    			t5 = space();
    			label2 = element("label");
    			img1 = element("img");
    			t6 = space();
    			label3 = element("label");
    			img2 = element("img");
    			t7 = space();
    			div1 = element("div");
    			img3 = element("img");
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			button = element("button");
    			t10 = text(t10_value);
    			t11 = space();
    			if (if_block0) if_block0.c();
    			t12 = space();
    			if_block1.c();
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "name", "pdf");
    			attr_dev(input0, "id", "pdf");
    			attr_dev(input0, "class", "hidden");
    			add_location(input0, file$6, 202, 4, 5418);
    			attr_dev(input1, "type", "file");
    			attr_dev(input1, "id", "image");
    			attr_dev(input1, "name", "image");
    			attr_dev(input1, "class", "hidden");
    			add_location(input1, file$6, 208, 4, 5533);
    			attr_dev(label0, "class", "whitespace-no-wrap bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 md:px-4 rounded mr-3 cursor-pointer md:mr-4");
    			attr_dev(label0, "for", "pdf");
    			add_location(label0, file$6, 214, 4, 5654);
    			if (!src_url_equal(img0.src, img0_src_value = "image.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "An icon for adding images");
    			add_location(img0, file$6, 229, 8, 6201);
    			attr_dev(label1, "class", "flex items-center justify-center h-full w-8 hover:bg-gray-500 cursor-pointer");
    			attr_dev(label1, "for", "image");
    			toggle_class(label1, "cursor-not-allowed", /*selectedPageIndex*/ ctx[5] < 0);
    			toggle_class(label1, "bg-gray-500", /*selectedPageIndex*/ ctx[5] < 0);
    			add_location(label1, file$6, 223, 6, 5957);
    			if (!src_url_equal(img1.src, img1_src_value = "notes.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "An icon for adding text");
    			add_location(img1, file$6, 238, 8, 6555);
    			attr_dev(label2, "class", "flex items-center justify-center h-full w-8 hover:bg-gray-500 cursor-pointer");
    			attr_dev(label2, "for", "text");
    			toggle_class(label2, "cursor-not-allowed", /*selectedPageIndex*/ ctx[5] < 0);
    			toggle_class(label2, "bg-gray-500", /*selectedPageIndex*/ ctx[5] < 0);
    			add_location(label2, file$6, 231, 6, 6278);
    			if (!src_url_equal(img2.src, img2_src_value = "gesture.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "An icon for adding drawing");
    			add_location(img2, file$6, 246, 8, 6886);
    			attr_dev(label3, "class", "flex items-center justify-center h-full w-8 hover:bg-gray-500 cursor-pointer");
    			toggle_class(label3, "cursor-not-allowed", /*selectedPageIndex*/ ctx[5] < 0);
    			toggle_class(label3, "bg-gray-500", /*selectedPageIndex*/ ctx[5] < 0);
    			add_location(label3, file$6, 240, 6, 6630);
    			attr_dev(div0, "class", "relative mr-3 flex h-8 bg-gray-400 rounded-sm overflow-hidden md:mr-4");
    			add_location(div0, file$6, 220, 4, 5855);
    			if (!src_url_equal(img3.src, img3_src_value = "edit.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "mr-2");
    			attr_dev(img3, "alt", "a pen, edit pdf name");
    			add_location(img3, file$6, 250, 6, 7054);
    			attr_dev(input2, "placeholder", "Ubah nama pdf");
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "flex-grow bg-transparent");
    			add_location(input2, file$6, 251, 6, 7124);
    			attr_dev(div1, "class", "justify-center mr-3 md:mr-4 w-full max-w-xs hidden md:flex");
    			add_location(div1, file$6, 249, 4, 6975);
    			attr_dev(button, "class", "w-20 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 md:px-4 mr-3 md:mr-4 rounded");
    			toggle_class(button, "cursor-not-allowed", /*pages*/ ctx[2].length === 0 || /*saving*/ ctx[6] || !/*pdfFile*/ ctx[0]);
    			toggle_class(button, "bg-blue-700", /*pages*/ ctx[2].length === 0 || /*saving*/ ctx[6] || !/*pdfFile*/ ctx[0]);
    			add_location(button, file$6, 257, 4, 7275);
    			attr_dev(div2, "class", "fixed z-10 top-0 left-0 right-0 h-12 flex justify-center items-center bg-gray-200 border-b border-gray-300");
    			add_location(div2, file$6, 199, 2, 5285);
    			attr_dev(main, "class", "flex flex-col items-center py-16 bg-gray-100 min-h-screen");
    			add_location(main, file$6, 198, 0, 5210);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwind, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, input0);
    			append_dev(div2, t1);
    			append_dev(div2, input1);
    			append_dev(div2, t2);
    			append_dev(div2, label0);
    			append_dev(div2, t4);
    			append_dev(div2, div0);
    			append_dev(div0, label1);
    			append_dev(label1, img0);
    			append_dev(div0, t5);
    			append_dev(div0, label2);
    			append_dev(label2, img1);
    			append_dev(div0, t6);
    			append_dev(div0, label3);
    			append_dev(label3, img2);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, img3);
    			append_dev(div1, t8);
    			append_dev(div1, input2);
    			set_input_value(input2, /*pdfName*/ ctx[1]);
    			append_dev(div2, t9);
    			append_dev(div2, button);
    			append_dev(button, t10);
    			append_dev(main, t11);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t12);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "dragenter", prevent_default(/*dragenter_handler*/ ctx[19]), false, true, false),
    					listen_dev(window, "dragover", prevent_default(/*dragover_handler*/ ctx[20]), false, true, false),
    					listen_dev(window, "drop", prevent_default(/*onUploadPDF*/ ctx[8]), false, true, false),
    					listen_dev(input0, "change", /*onUploadPDF*/ ctx[8], false, false, false),
    					listen_dev(input1, "change", /*onUploadImage*/ ctx[9], false, false, false),
    					listen_dev(label2, "click", /*onAddTextField*/ ctx[10], false, false, false),
    					listen_dev(label3, "click", /*onAddDrawing*/ ctx[11], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    					listen_dev(button, "click", /*savePDF*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedPageIndex*/ 32) {
    				toggle_class(label1, "cursor-not-allowed", /*selectedPageIndex*/ ctx[5] < 0);
    			}

    			if (dirty[0] & /*selectedPageIndex*/ 32) {
    				toggle_class(label1, "bg-gray-500", /*selectedPageIndex*/ ctx[5] < 0);
    			}

    			if (dirty[0] & /*selectedPageIndex*/ 32) {
    				toggle_class(label2, "cursor-not-allowed", /*selectedPageIndex*/ ctx[5] < 0);
    			}

    			if (dirty[0] & /*selectedPageIndex*/ 32) {
    				toggle_class(label2, "bg-gray-500", /*selectedPageIndex*/ ctx[5] < 0);
    			}

    			if (dirty[0] & /*selectedPageIndex*/ 32) {
    				toggle_class(label3, "cursor-not-allowed", /*selectedPageIndex*/ ctx[5] < 0);
    			}

    			if (dirty[0] & /*selectedPageIndex*/ 32) {
    				toggle_class(label3, "bg-gray-500", /*selectedPageIndex*/ ctx[5] < 0);
    			}

    			if (dirty[0] & /*pdfName*/ 2 && input2.value !== /*pdfName*/ ctx[1]) {
    				set_input_value(input2, /*pdfName*/ ctx[1]);
    			}

    			if ((!current || dirty[0] & /*saving*/ 64) && t10_value !== (t10_value = (/*saving*/ ctx[6] ? 'Saving' : 'Simpan') + "")) set_data_dev(t10, t10_value);

    			if (dirty[0] & /*pages, saving, pdfFile*/ 69) {
    				toggle_class(button, "cursor-not-allowed", /*pages*/ ctx[2].length === 0 || /*saving*/ ctx[6] || !/*pdfFile*/ ctx[0]);
    			}

    			if (dirty[0] & /*pages, saving, pdfFile*/ 69) {
    				toggle_class(button, "bg-blue-700", /*pages*/ ctx[2].length === 0 || /*saving*/ ctx[6] || !/*pdfFile*/ ctx[0]);
    			}

    			if (/*addingDrawing*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*addingDrawing*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t12);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwind.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwind.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwind, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const genID = ggID();
    	let pdfFile;
    	let pdfName = "";
    	let pages = [];
    	let pagesScale = [];
    	let allObjects = [];
    	let currentFont = "Times-Roman";
    	let focusId = null;
    	let selectedPageIndex = -1;
    	let saving = false;
    	let addingDrawing = false;

    	// for test purpose
    	onMount(async () => {
    		try {
    			const res = await fetch("test.pdf");
    			const pdfBlob = await res.blob();
    			await addPDF(pdfBlob);
    			$$invalidate(5, selectedPageIndex = 0);

    			setTimeout(
    				() => {
    					fetchFont(currentFont);
    					prepareAssets();
    				},
    				5000
    			);
    		} catch(e) {
    			console.log(e); // const imgBlob = await (await fetch("/test.jpg")).blob();
    		}
    	});

    	async function onUploadPDF(e) {
    		const files = e.target.files || e.dataTransfer && e.dataTransfer.files;
    		const file = files[0];
    		if (!file || file.type !== "application/pdf") return;
    		$$invalidate(5, selectedPageIndex = -1);

    		try {
    			await addPDF(file);
    			$$invalidate(5, selectedPageIndex = 0);
    		} catch(e) {
    			console.log(e);
    		}
    	}

    	async function addPDF(file) {
    		try {
    			const pdf = await readAsPDF(file);
    			$$invalidate(1, pdfName = file.name);
    			$$invalidate(0, pdfFile = file);
    			const numPages = pdf.numPages;
    			$$invalidate(2, pages = Array(numPages).fill().map((_, i) => pdf.getPage(i + 1)));
    			$$invalidate(4, allObjects = pages.map(() => []));
    			$$invalidate(3, pagesScale = Array(numPages).fill(1));
    		} catch(e) {
    			console.log("Failed to add pdf.");
    			throw e;
    		}
    	}

    	async function onUploadImage(e) {
    		const file = e.target.files[0];

    		if (file && selectedPageIndex >= 0) {
    			addImage(file);
    		}

    		e.target.value = null;
    	}

    	async function addImage(file) {
    		try {
    			// get dataURL to prevent canvas from tainted
    			const url = await readAsDataURL(file);

    			const img = await readAsImage(url);
    			const id = genID();
    			const { width, height } = img;

    			const object = {
    				id,
    				type: "image",
    				width,
    				height,
    				x: 0,
    				y: 0,
    				payload: img,
    				file
    			};

    			$$invalidate(4, allObjects = allObjects.map((objects, pIndex) => pIndex === selectedPageIndex
    			? [...objects, object]
    			: objects));
    		} catch(e) {
    			console.log(`Fail to add image.`, e);
    		}
    	}

    	function onAddTextField() {
    		if (selectedPageIndex >= 0) {
    			addTextField();
    		}
    	}

    	function addTextField(text = "Teks Baru") {
    		const id = genID();
    		fetchFont(currentFont);

    		const object = {
    			id,
    			text,
    			type: "text",
    			size: 16,
    			width: 0, // recalculate after editing
    			lineHeight: 1.4,
    			fontFamily: currentFont,
    			x: 0,
    			y: 0
    		};

    		$$invalidate(4, allObjects = allObjects.map((objects, pIndex) => pIndex === selectedPageIndex
    		? [...objects, object]
    		: objects));
    	}

    	function onAddDrawing() {
    		if (selectedPageIndex >= 0) {
    			$$invalidate(7, addingDrawing = true);
    		}
    	}

    	function addDrawing(originWidth, originHeight, path, scale = 1) {
    		const id = genID();

    		const object = {
    			id,
    			path,
    			type: "drawing",
    			x: 0,
    			y: 0,
    			originWidth,
    			originHeight,
    			width: originWidth * scale,
    			scale
    		};

    		$$invalidate(4, allObjects = allObjects.map((objects, pIndex) => pIndex === selectedPageIndex
    		? [...objects, object]
    		: objects));
    	}

    	function selectFontFamily(event) {
    		const name = event.detail.name;
    		fetchFont(name);
    		currentFont = name;
    	}

    	function selectPage(index) {
    		$$invalidate(5, selectedPageIndex = index);
    	}

    	function updateObject(objectId, payload) {
    		$$invalidate(4, allObjects = allObjects.map((objects, pIndex) => pIndex == selectedPageIndex
    		? objects.map(object => object.id === objectId
    			? { ...object, ...payload }
    			: object)
    		: objects));
    	}

    	function deleteObject(objectId) {
    		$$invalidate(4, allObjects = allObjects.map((objects, pIndex) => pIndex == selectedPageIndex
    		? objects.filter(object => object.id !== objectId)
    		: objects));
    	}

    	function onMeasure(scale, i) {
    		$$invalidate(3, pagesScale[i] = scale, pagesScale);
    	}

    	// FIXME: Should wait all objects finish their async work
    	async function savePDF() {
    		if (!pdfFile || saving || !pages.length) return;
    		$$invalidate(6, saving = true);

    		try {
    			await save(pdfFile, allObjects, pdfName, pagesScale);
    		} catch(e) {
    			console.log(e);
    		} finally {
    			$$invalidate(6, saving = false);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function dragenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dragover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input2_input_handler() {
    		pdfName = this.value;
    		$$invalidate(1, pdfName);
    	}

    	const finish_handler = e => {
    		const { originWidth, originHeight, path } = e.detail;
    		let scale = 1;

    		if (originWidth > 500) {
    			scale = 500 / originWidth;
    		}

    		addDrawing(originWidth, originHeight, path, scale);
    		$$invalidate(7, addingDrawing = false);
    	};

    	const cancel_handler = () => $$invalidate(7, addingDrawing = false);

    	function input_input_handler() {
    		pdfName = this.value;
    		$$invalidate(1, pdfName);
    	}

    	const measure_handler = (pIndex, e) => onMeasure(e.detail.scale, pIndex);
    	const update_handler = (object, e) => updateObject(object.id, e.detail);
    	const delete_handler = object => deleteObject(object.id);
    	const update_handler_1 = (object, e) => updateObject(object.id, e.detail);
    	const delete_handler_1 = object => deleteObject(object.id);
    	const update_handler_2 = (object, e) => updateObject(object.id, e.detail);
    	const delete_handler_2 = object => deleteObject(object.id);
    	const mousedown_handler = pIndex => selectPage(pIndex);
    	const touchstart_handler = pIndex => selectPage(pIndex);

    	$$self.$capture_state = () => ({
    		onMount,
    		fly,
    		Tailwind,
    		PDFPage,
    		Image: Image$1,
    		Text,
    		Drawing,
    		DrawingCanvas,
    		prepareAssets,
    		fetchFont,
    		readAsArrayBuffer,
    		readAsImage,
    		readAsPDF,
    		readAsDataURL,
    		ggID,
    		save,
    		genID,
    		pdfFile,
    		pdfName,
    		pages,
    		pagesScale,
    		allObjects,
    		currentFont,
    		focusId,
    		selectedPageIndex,
    		saving,
    		addingDrawing,
    		onUploadPDF,
    		addPDF,
    		onUploadImage,
    		addImage,
    		onAddTextField,
    		addTextField,
    		onAddDrawing,
    		addDrawing,
    		selectFontFamily,
    		selectPage,
    		updateObject,
    		deleteObject,
    		onMeasure,
    		savePDF
    	});

    	$$self.$inject_state = $$props => {
    		if ('pdfFile' in $$props) $$invalidate(0, pdfFile = $$props.pdfFile);
    		if ('pdfName' in $$props) $$invalidate(1, pdfName = $$props.pdfName);
    		if ('pages' in $$props) $$invalidate(2, pages = $$props.pages);
    		if ('pagesScale' in $$props) $$invalidate(3, pagesScale = $$props.pagesScale);
    		if ('allObjects' in $$props) $$invalidate(4, allObjects = $$props.allObjects);
    		if ('currentFont' in $$props) currentFont = $$props.currentFont;
    		if ('focusId' in $$props) focusId = $$props.focusId;
    		if ('selectedPageIndex' in $$props) $$invalidate(5, selectedPageIndex = $$props.selectedPageIndex);
    		if ('saving' in $$props) $$invalidate(6, saving = $$props.saving);
    		if ('addingDrawing' in $$props) $$invalidate(7, addingDrawing = $$props.addingDrawing);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		pdfFile,
    		pdfName,
    		pages,
    		pagesScale,
    		allObjects,
    		selectedPageIndex,
    		saving,
    		addingDrawing,
    		onUploadPDF,
    		onUploadImage,
    		onAddTextField,
    		onAddDrawing,
    		addDrawing,
    		selectFontFamily,
    		selectPage,
    		updateObject,
    		deleteObject,
    		onMeasure,
    		savePDF,
    		dragenter_handler,
    		dragover_handler,
    		input2_input_handler,
    		finish_handler,
    		cancel_handler,
    		input_input_handler,
    		measure_handler,
    		update_handler,
    		delete_handler,
    		update_handler_1,
    		delete_handler_1,
    		update_handler_2,
    		delete_handler_2,
    		mousedown_handler,
    		touchstart_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    getAsset('pdfjsLib');
    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
