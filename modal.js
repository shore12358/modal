/**
 *
 * Created by Joan on 17/4/28.
 */
(function () {

    let util;

    util = (function () {

        //test is element node or not
        let isEleNode = function (obj) {
            return typeof obj == 'object' && obj.nodeType == 1;
        };

        return {

            //test a node has the class string or not
            isContain: function (node, token) {
                if (isEleNode(node)) {
                    let flag = false,
                        len  = node.classList.length;
                    if (len) {
                        for (let i = 0; i < len; i++) {
                            if (node.classList[i] === token) {
                                flag = true;
                                break;
                            }
                        }
                    }
                    return flag;
                }

            },
            modal: {
                setId: function () {
                    this.identity = Math.floor(Math.random() * Math.pow(10, 10));
                },
                setBtnWrapper: (function () {
                    function setBtn(_name, _cb) {
                        let btn = document.createElement('button');
                        btn.innerText = _name;
                        btn.addEventListener('click', () => {
                            this.hide();
                            _cb && _cb();
                        });
                        this.btnWrapper.appendChild(btn);
                    }

                    return function (obj) {
                        this.btnWrapper = createE('div', 'btn-wrapper');
                        obj.btn instanceof Array && obj.btn.forEach((item) => {
                            let name, callback;
                            name = typeof item === 'object' && item.name ? item.name : 'close',
                                callback = typeof item === 'object' && typeof item.callback === 'function' ? item.callback : null;
                            setBtn.call(this, name, callback);
                        });
                    }

                }()),
                assembly: function (obj) {
                    let m_width  = window.innerWidth,
                        m_height = window.innerHeight,
                        node;

                    this.mask = `<div class="aw-mask" style="width:${m_width}px; height: ${m_height}px;"></div>`;

                    util.modal.setId.call(this);
                    util.modal.setBtnWrapper.call(this, obj);

                    node = createE('div', 'aw-modal');
                    node.innerHTML = `${this.titleWrapper}${this.textWrapper}`;
                    node.appendChild(this.btnWrapper);
                    this.modalWrapper = node;

                }

            }

        }
    })();

    //find by only one of its className or id.
    HTMLElement.prototype.findParents = findParents;
    function findParents (str) {

        if (typeof str == 'string') {
            let copy    = str.trim().replace(/\s+/,''),
                current = this,
                token   = copy.slice(1);    //'.'or'#'

            switch (copy[0]) {
            case '#':
                while(current.parentNode.id !== token) {
                    current = current.parentNode;
                }
                break;
            case '.':
                while(!util.isContain(current.parentNode, token)) {
                    current = current.parentNode;
                }
                break;
            }

            return current.parentNode;
        }
    }

    //config: title/text/button text/button callback/can be closed or not

    /*
     * an example of obj
     * {
     *     'title': string,
     *     'text': string,
     *     'btn': [{
     *         name: string,
     *         callback: function
     *      }]
     * }
     */
    function Modal (obj) {

        if (obj && typeof obj === 'object') {
            let title, text;
            title = typeof obj.title == 'string' ? obj.title : 'Your Title';
            text  = typeof obj.text == 'string' ? obj.text : 'here please show you msn!';
            this.titleWrapper = `
                <div class="title-wrapper">
                    <h4>${title}<span class="close-btn" onclick="modalHide(event)">x</span></h4>
                </div>
            `;
            this.textWrapper = `
                <div class="text-wrapper">
                    <p>${text}</p>
                </div>
            `;

            util.modal.assembly.call(this, obj);

        }
    };

    function modalHide(ev) {
        let _parent = ev.target.findParents('.aw-modal-container');
        _parent.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    window.modalHide = modalHide;

    function createE(tag, className) {
        let node;
        node = typeof tag === 'string' ? document.createElement(tag) : document.createElement('div');
        node.className = typeof className === 'string' ? className : '';
        return node;
    };

    util.createE = window.createE = createE;

    Modal.prototype.isOnStage = false;

    Modal.prototype.hide = function () {
        if (this.isOnStage) {
            let _id = `aw-modal-${this.identity}`;
            document.getElementById(_id).style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    Modal.prototype.show = function () {
        if (this.isOnStage) {
            document.getElementById(`aw-modal-${this.identity}`).style.display = 'block';
        } else {
            let node = createE('div', 'aw-modal-container');
            node.id = `aw-modal-${this.identity}`;
            node.innerHTML = this.mask;
            node.appendChild(this.modalWrapper);
            document.body.appendChild(node);
            this.isOnStage = true;
        }
        document.body.style.overflow = 'hidden';
    }

    window.Modal = Modal;

})();
