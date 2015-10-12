﻿module FoodParent {
    export class MapViewFactory {
        private static _instance: MapViewFactory = new MapViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (MapViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use MapViewFactory.getInstance() instead of new.");
            }
            MapViewFactory._instance = this;
        }
        public static getInstance(): MapViewFactory {
            return MapViewFactory._instance;
        }
        public create(el: JQuery, bCentered: boolean): Backbone.View<Backbone.Model> {
            var view: MapView = new MapView({ el: el });
            view.setIsCentered(true);
            return view;
        }
        public create2(el: JQuery, bCentered: boolean): Backbone.View<Backbone.Model> {
            var view: MapView = new MapView({ el: el });
            view.setIsCentered(false);
            return view;
        }
    }
}