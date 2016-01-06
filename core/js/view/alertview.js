var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var AdoptionManageViewFactory = (function () {
        function AdoptionManageViewFactory(args) {
            if (AdoptionManageViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AdoptionManageViewFactory.getInstance() instead of new.");
            }
            AdoptionManageViewFactory._instance = this;
        }
        AdoptionManageViewFactory.getInstance = function () {
            return AdoptionManageViewFactory._instance;
        };
        AdoptionManageViewFactory.create = function (el, tree) {
            var view = new AdoptionManageView({ el: el });
            console.log(tree);
            view.setTree(tree);
            return view;
        };
        AdoptionManageViewFactory._instance = new AdoptionManageViewFactory();
        return AdoptionManageViewFactory;
    })();
    FoodParent.AdoptionManageViewFactory = AdoptionManageViewFactory;
    var ConfirmViewFractory = (function () {
        function ConfirmViewFractory(args) {
            if (ConfirmViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ConfirmViewFractory.getInstance() instead of new.");
            }
            ConfirmViewFractory._instance = this;
        }
        ConfirmViewFractory.getInstance = function () {
            return ConfirmViewFractory._instance;
        };
        ConfirmViewFractory.create = function (el, message, command) {
            var view = new ConfirmView({ el: el });
            view.setMessage(message);
            view.setCommand(command);
            return view;
        };
        ConfirmViewFractory._instance = new ConfirmViewFractory();
        return ConfirmViewFractory;
    })();
    FoodParent.ConfirmViewFractory = ConfirmViewFractory;
    var AlertViewFractory = (function () {
        function AlertViewFractory(args) {
            if (AlertViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use AlertViewFractory.getInstance() instead of new.");
            }
            AlertViewFractory._instance = this;
        }
        AlertViewFractory.getInstance = function () {
            return AlertViewFractory._instance;
        };
        AlertViewFractory.create = function (el, errorMode) {
            var view = new AlertView({ el: el });
            view.setErrorMode(errorMode);
            return view;
        };
        AlertViewFractory._instance = new AlertViewFractory();
        return AlertViewFractory;
    })();
    FoodParent.AlertViewFractory = AlertViewFractory;
    var PopupView = (function (_super) {
        __extends(PopupView, _super);
        function PopupView() {
            _super.apply(this, arguments);
        }
        return PopupView;
    })(FoodParent.BaseView);
    FoodParent.PopupView = PopupView;
    var AlertView = (function (_super) {
        __extends(AlertView, _super);
        function AlertView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .alert-confirm": "_mouseClick",
                "click .alert-cancel": "_mouseClick",
            };
            self.delegateEvents();
        }
        AlertView.prototype.setErrorMode = function (errorMode) {
            var self = this;
            self._errorMode = errorMode;
        };
        AlertView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(AlertView.TAG + "render()");
            var template = _.template(FoodParent.Template.getAlertViewTemplate());
            var data;
            var tag = "";
            switch (self._errorMode) {
                case FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR:
                    tag += "<p>The device cannot find its's location information.<br />Please turn Geolocation setting on & refresh the page.</p>";
                    tag += "<div class='button-outer-frame button1'><div class='button-inner-frame alert-confirm'>Confirm</div></div>";
                    break;
                case FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR:
                    tag += "<p>There is a server connection error.<br/>If the issue won't be solved by the refreshing page,";
                    tag += "<br/>please contact <a href='mailto:" + FoodParent.Setting.getDevContact() + "'>" + FoodParent.Setting.getDevContact() + "</a>.</p>";
                    tag += "<div class='button-outer-frame button1'><div class='button-inner-frame alert-confirm'>Confirm</div></div>";
                    break;
            }
            data = {
                content: tag,
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-alert'));
            self.setVisible();
            return self;
        };
        AlertView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self = this;
            if (self.bDebug)
                console.log(AlertView.TAG + "update()");
            return self;
        };
        AlertView.prototype._mouseEnter = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseEnter($(event.currentTarget), self);
        };
        AlertView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        AlertView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        AlertView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        AlertView.TAG = "AlertView - ";
        return AlertView;
    })(PopupView);
    FoodParent.AlertView = AlertView;
    var ConfirmView = (function (_super) {
        __extends(ConfirmView, _super);
        function ConfirmView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
            };
            self.delegateEvents();
        }
        ConfirmView.prototype.setMessage = function (message) {
            var self = this;
            self._message = message;
        };
        ConfirmView.prototype.setCommand = function (command) {
            var self = this;
            self._command = command;
        };
        ConfirmView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(ConfirmView.TAG + "render()");
            var tag = "";
            tag += "<p>" + self._message + "<br/> This action cannot be undone.</p>";
            tag += "<div class='confirm-button-group'>";
            tag += "<div class='button-outer-frame button1'><div class='button-inner-frame confirm-confirm'>Confirm</div></div>";
            tag += "<div class='button-outer-frame button1'><div class='button-inner-frame confirm-cancel'>Cancel</div></div>";
            tag += "</div>";
            var template = _.template(FoodParent.Template.getConfirmViewTemplate());
            var data = {
                content: tag,
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-confirm'));
            self.setVisible();
            return self;
        };
        ConfirmView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self = this;
            if (self.bDebug)
                console.log(ConfirmView.TAG + "update()");
            return self;
        };
        ConfirmView.prototype._mouseEnter = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseEnter($(event.currentTarget), self);
        };
        ConfirmView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        ConfirmView.prototype._executeCommand = function (event) {
            var self = this;
            self._command.execute();
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        ConfirmView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        ConfirmView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        ConfirmView.TAG = "ConfirmView - ";
        return ConfirmView;
    })(PopupView);
    FoodParent.ConfirmView = ConfirmView;
    var AdoptionManageView = (function (_super) {
        __extends(AdoptionManageView, _super);
        function AdoptionManageView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderPersons = function () {
                var self = _this;
                FoodParent.Controller.fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts(function () {
                    // add grid instance for existing data
                    self.renderPersonsList(FoodParent.Model.getPersons());
                    self.renderFilterList();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderFilterList = function () {
                var self = _this;
                var template = _.template(FoodParent.Template.getAdoptionFilterListTemplate());
                var data = {
                    auths: FoodParent.Model.getAuths(),
                };
                self.$('#filter-list').html(template(data));
            };
            this.renderPersonsList = function (persons) {
                var self = _this;
                var grid = new Backgrid.Grid({
                    columns: AdoptionColumn,
                    collection: persons,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                grid.sort("name", "ascending");
                self.$(".list-adoption").html(grid.el);
            };
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
                "click .button-close": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
            };
            self.delegateEvents();
        }
        AdoptionManageView.prototype.setTree = function (treeId) {
            var self = this;
            console.log(treeId);
            self._tree = FoodParent.Model.getTrees().findWhere({ id: treeId });
        };
        AdoptionManageView.prototype.getTree = function () {
            var self = this;
            return self._tree;
        };
        AdoptionManageView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(AdoptionManageView.TAG + "render()");
            var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(FoodParent.Template.getManageAdoptionViewTemplate());
            var data = {
                treename: food.getName() + " " + self._tree.getName(),
                treeId: self._tree.getId(),
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-manage-adoption'));
            self.renderPersons();
            self.setVisible();
            self.resize();
            return self;
        };
        AdoptionManageView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self = this;
            if (self.bDebug)
                console.log(AdoptionManageView.TAG + "update()");
            return self;
        };
        AdoptionManageView.prototype.resize = function () {
            var self = this;
            $('#content-manage-adoption-table').css({ width: self.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: FoodParent.View.getHeight() - 60 });
            $('.collapsible-list').css({ height: self.getHeight() - 34 * 2 - 30 });
        };
        AdoptionManageView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        AdoptionManageView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        AdoptionManageView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        AdoptionManageView.prototype._applyFilter = function (event) {
            var self = this;
            var persons = FoodParent.Model.getPersons();
            setTimeout(function () {
                // Filtering food type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'authsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-auth').addClass('active');
                            $('.filter-auth input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-auth').removeClass('active');
                            $('.filter-auth input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply auth filtering
                var authIds = new Array();
                $.each(self.$('.filter-auth input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        authIds.push(Math.floor($(item).prop('name')));
                    }
                });
                persons = persons.filterByAuthIds(authIds);
                // Filtering adoption status.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'adoptsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-adopt').addClass('active');
                            $('.filter-adopt input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-adopt').removeClass('active');
                            $('.filter-adopt input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply adopt filtering
                var adoptIds = new Array();
                $.each(self.$('.filter-adopt input'), function (index, item) {
                    console.log($(item).prop('checked'));
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });
                persons = persons.filterByAdoptStatusForTree(adoptIds, self._tree.getId());
                // update markers
                self.renderPersonsList(persons);
            }, 1);
        };
        AdoptionManageView.TAG = "AdoptionManageView - ";
        return AdoptionManageView;
    })(PopupView);
    FoodParent.AdoptionManageView = AdoptionManageView;
})(FoodParent || (FoodParent = {}));
