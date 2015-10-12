var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FoodParent;
(function (FoodParent) {
    (function (MainViewType) {
        MainViewType[MainViewType["NONE"] = 0] = "NONE";
        MainViewType[MainViewType["TREES"] = 1] = "TREES";
        MainViewType[MainViewType["TREE"] = 2] = "TREE";
        MainViewType[MainViewType["NOTE"] = 3] = "NOTE";
        MainViewType[MainViewType["ABOUT"] = 4] = "ABOUT";
    })(FoodParent.MainViewType || (FoodParent.MainViewType = {}));
    var MainViewType = FoodParent.MainViewType;
    var View = (function (_super) {
        __extends(View, _super);
        function View(options) {
            var _this = this;
            _super.call(this, options);
            this.renderTreeInfo = function (tree) {
                var that = _this;
                switch (that.viewType) {
                    case 1 /* TREES */:
                        var views = that.bodyView.getViews();
                        var validView;
                        $.each(views, function (index, view) {
                            if (view instanceof FoodParent.SideInfoView) {
                                validView = view;
                            }
                        });
                        validView.customRender(tree);
                        break;
                    case 2 /* TREE */:
                        var views = that.bodyView.getViews();
                        var validView2;
                        var validView3;
                        $.each(views, function (index, view) {
                            if (view instanceof FoodParent.TreeInfoView) {
                                validView2 = view;
                            }
                            if (view instanceof FoodParent.CoverflowView) {
                                validView3 = view;
                            }
                        });
                        validView2.customRender(tree);
                        validView3.customRender(tree);
                        break;
                    case 3 /* NOTE */:
                        break;
                    case 4 /* ABOUT */:
                        break;
                }
            };
            if (View._instance) {
                throw new Error("Error: Instantiation failed: Use View.getInstance() instead of new.");
            }
            View._instance = this;
            var that = this;
        }
        View.setElement = function (options) {
            View._instance.setElement(options.el);
        };
        View.getInstance = function () {
            return View._instance;
        };
        View.prototype.SetViewType = function (viewType) {
            this.viewType = viewType;
        };
        View.prototype.getViewType = function () {
            return this.viewType;
        };
        View.prototype.setMapView = function (mapView) {
            this.mapView = mapView;
        };
        View.prototype.getMapView = function () {
            return this.mapView;
        };
        View.prototype.render = function () {
            var that = this;
            var template = _.template(FoodParent.Template.getInstance().getBaseTemplate());
            var data = {};
            that.$el.html(template(data));
            if (that.headerView != undefined) {
                that.headerView.destroy();
            }
            that.headerView = FoodParent.HeaderFactory.getInstance().create(that.$('#wrapper-main-header'));
            that.headerView.render();
            if (that.bodyView != undefined) {
                that.bodyView.destroy();
            }
            that.mapView = undefined;
            switch (that.viewType) {
                case 1 /* TREES */:
                    that.bodyView = FoodParent.TreesViewFactory.getInstance().create(that.$('#wrapper-main-body'));
                    that.bodyView.render();
                    break;
                case 2 /* TREE */:
                    that.bodyView = FoodParent.TreeViewFactory.getInstance().create(that.$('#wrapper-main-body'), FoodParent.Controller.getInstance().getCurrent());
                    that.bodyView.render();
                    break;
                case 3 /* NOTE */:
                    break;
                case 4 /* ABOUT */:
                    break;
            }
            return that;
        };
        View.prototype.renderTreesOnMap = function (trees) {
            var that = this;
            if (that.mapView != undefined) {
                switch (that.viewType) {
                    case 1 /* TREES */:
                        var exist = new FoodParent.Trees();
                        var markers = that.mapView.getAllMarkers();
                        $.each(trees.models, function (i, model) {
                            $.each(markers, function (j, marker) {
                                var food = FoodParent.Model.getInstance().getFoods().findWhere({
                                    id: model.getFoodId()
                                });
                                if (marker.options.name == (food.getName() + model.getName())) {
                                    exist.add(model);
                                }
                            });
                        });
                        $.each(markers, function (j, marker) {
                            var bDeleted = true;
                            $.each(exist.models, function (i, model) {
                                var food = FoodParent.Model.getInstance().getFoods().findWhere({
                                    id: model.getFoodId()
                                });
                                if (marker.options.name != (food.getName() + model.getName())) {
                                    bDeleted = false;
                                }
                            });
                            if (bDeleted) {
                                that.mapView.removeMarker(marker);
                            }
                        });
                        $.each(trees.models, function (index, model) {
                            if (exist.findWhere({ id: model.getId() }) == undefined) {
                                that.createMarker(model);
                            }
                        });
                        break;
                    case 2 /* TREE */:
                        var exist = new FoodParent.Trees();
                        var markers = that.mapView.getAllMarkers();
                        $.each(trees.models, function (i, model) {
                            $.each(markers, function (j, marker) {
                                var food = FoodParent.Model.getInstance().getFoods().findWhere({
                                    id: model.getFoodId()
                                });
                                if (marker.options.name == (food.getName() + model.getName())) {
                                    exist.add(model);
                                }
                            });
                        });
                        $.each(markers, function (j, marker) {
                            var bDeleted = true;
                            $.each(exist.models, function (i, model) {
                                var food = FoodParent.Model.getInstance().getFoods().findWhere({
                                    id: model.getFoodId()
                                });
                                if (marker.options.name != (food.getName() + model.getName())) {
                                    bDeleted = false;
                                }
                            });
                            if (bDeleted) {
                                that.mapView.removeMarker(marker);
                            }
                        });
                        var tree = FoodParent.Model.getInstance().getTrees().findWhere({ id: FoodParent.Controller.getInstance().getCurrent() });
                        $.each(trees.models, function (index, model) {
                            if (exist.findWhere({ id: model.getId() }) == undefined) {
                                that.createMarker2(model, (tree == model));
                            }
                        });
                        break;
                    case 3 /* NOTE */:
                        break;
                    case 4 /* ABOUT */:
                        break;
                }
            }
        };
        View.prototype.createMarker = function (model) {
            var that = this;
            var view = FoodParent.MarkerViewFactory.getInstance().create(model);
            view.getMarker().on('popupopen', function (event) {
                that.renderTreeInfo(model);
                $('.leaflet-popup-content .glyphicon').off('click');
                $('.leaflet-popup-content .glyphicon').on('click', function (event) {
                    FoodParent.Router.getInstance().navigate("tree/" + $('.leaflet-popup-content .glyphicon').attr('data-id'), { trigger: true });
                });
            });
            view.getMarker().on('popupclose', function () {
                that.renderTreeInfo(null);
            });
            that.mapView.addMarker(view.getMarker());
        };
        View.prototype.createMarker2 = function (model, bPopupOpen) {
            var that = this;
            var view = FoodParent.MarkerViewFactory.getInstance().create2(model);
            view.getMarker().on('click', function (event) {
                if (event.target._popup == undefined) {
                }
                else {
                    this.openPopup();
                }
            });
            view.getMarker().on('popupopen', function (event) {
                that.renderTreeInfo(model);
                FoodParent.Router.getInstance().navigate("tree/" + $('.leaflet-popup-content span').attr('data-id'), { trigger: false });
            });
            view.getMarker().on('popupclose', function () {
                that.renderTreeInfo(null);
            });
            that.mapView.addMarker(view.getMarker());
            if (bPopupOpen) {
                view.getMarker().openPopup();
            }
        };
        View._instance = new View();
        return View;
    })(Backbone.View);
    FoodParent.View = View;
})(FoodParent || (FoodParent = {}));
