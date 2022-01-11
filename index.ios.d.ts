import {  BoundsBase, CircleBase, MarkerBase, PolygonBase, PolylineBase, ProjectionBase, PositionBase, ShapeBase, VisibleRegionBase, StyleBase, UISettingsBase, GoogleMapsCommon } from "./common";
import { Image, Color } from "@nativescript/core";
import { Point } from "@nativescript/core/ui/core/view";

export declare class GoogleMaps extends GoogleMapsCommon {
    protected _markers: Array<Marker>;
    private _delegate;
    private _indoorDelegate;
    constructor();
    onLoaded(): void;
    onUnloaded(): void;
    disposeNativeView(): void;
    private _createCameraPosition;
    updateCamera(): void;
    setViewport(bounds: Bounds, padding?: number): void;
    updatePadding(): void;
// @ts-ignore
    get ios(): never;
// @ts-ignore
    get gMap(): any;
// @ts-ignore
    get projection(): Projection;
// @ts-ignore
    get settings(): UISettings;
// @ts-ignore
    get myLocationEnabled(): boolean;
    set myLocationEnabled(value: boolean);
    setMinZoomMaxZoom(): void;
    addMarker(...markers: Marker[]): any;
    removeMarker(...markers: Marker[]): any;
    removeAllMarkers(): any;
    findMarker(callback: (marker: Marker) => boolean): Marker;
    addPolyline(shape: Polyline): any;
    addPolygon(shape: Polygon): any;
    addCircle(shape: Circle): any;
    removeShape(shape: ShapeBase): any;
    removeAllShapes(): any;
    findShape(callback: (shape: ShapeBase) => boolean): ShapeBase;
    clear(): void;
    setStyle(style: StyleBase): boolean;
}
export declare class UISettings extends UISettingsBase {
    private _ios;
// @ts-ignore
    get ios(): any;
    constructor(ios: any);
// @ts-ignore
    get compassEnabled(): boolean;
    set compassEnabled(value: boolean);
// @ts-ignore
    get indoorLevelPickerEnabled(): boolean;
    set indoorLevelPickerEnabled(value: boolean);
// @ts-ignore
    get mapToolbarEnabled(): boolean;
    set mapToolbarEnabled(value: boolean);
// @ts-ignore
    get myLocationButtonEnabled(): boolean;
    set myLocationButtonEnabled(value: boolean);
// @ts-ignore
    get rotateGesturesEnabled(): boolean;
    set rotateGesturesEnabled(value: boolean);
// @ts-ignore
    get scrollGesturesEnabled(): boolean;
    set scrollGesturesEnabled(value: boolean);
// @ts-ignore
    get tiltGesturesEnabled(): boolean;
    set tiltGesturesEnabled(value: boolean);
// @ts-ignore
    get zoomControlsEnabled(): boolean;
    set zoomControlsEnabled(value: boolean);
// @ts-ignore
    get zoomGesturesEnabled(): boolean;
    set zoomGesturesEnabled(value: boolean);
}
export declare class Projection extends ProjectionBase {
    private _ios;
// @ts-ignore
    get ios(): any;
// @ts-ignore
    get visibleRegion(): VisibleRegion;
    fromScreenLocation(point: Point): Position;
    toScreenLocation(position: Position): {
        x: any;
        y: any;
    };
    constructor(ios: any);
}
export declare class VisibleRegion extends VisibleRegionBase {
    private _ios;
// @ts-ignore
    get ios(): any;
// @ts-ignore
    get nearLeft(): Position;
// @ts-ignore
    get nearRight(): Position;
// @ts-ignore
    get farLeft(): Position;
// @ts-ignore
    get farRight(): Position;
// @ts-ignore
    get bounds(): Bounds;
    constructor(ios: any);
}
export declare class Bounds extends BoundsBase {
    private _ios;
// @ts-ignore
    get ios(): GMSCoordinateBounds;
// @ts-ignore
    get southwest(): Position;
// @ts-ignore
    get northeast(): Position;
    // @ts-ignore
    constructor(ios: GMSCoordinateBounds);
    static fromCoordinates(southwest: Position, northeast: Position): Bounds;
}
export declare class Position extends PositionBase {
    private _ios;
// @ts-ignore
    get ios(): any;
// @ts-ignore
    get latitude(): any;
    set latitude(latitude: any);
// @ts-ignore
    get longitude(): any;
    set longitude(longitude: any);
    // @ts-ignore
    constructor(ios?: CLLocationCoordinate2D);
    static positionFromLatLng(latitude: number, longitude: number): Position;
}
export declare class Marker extends MarkerBase {
    private _ios;
    private _color;
    private _icon;
    private _alpha;
    private _visible;
    private static cachedColorIcons;
    private static getIconForColor;
    constructor();
// @ts-ignore
    get position(): Position;
    set position(position: Position);
// @ts-ignore
    get rotation(): number;
    set rotation(value: number);
// @ts-ignore
    get zIndex(): number;
    set zIndex(value: number);
// @ts-ignore
    get title(): any;
    set title(title: any);
// @ts-ignore
    get snippet(): any;
    set snippet(snippet: any);
    showInfoWindow(): void;
    isInfoWindowShown(): boolean;
    hideInfoWindow(): void;
// @ts-ignore
    get color(): Color | string | number;
    set color(value: Color | string | number);
// @ts-ignore
    get icon(): Image | string;
    set icon(value: Image | string);
// @ts-ignore
    get alpha(): number;
    set alpha(value: number);
// @ts-ignore
    get visible(): boolean;
    set visible(value: boolean);
// @ts-ignore
    get flat(): boolean;
    set flat(value: boolean);
// @ts-ignore
    get anchor(): Array<number>;
    set anchor(value: Array<number>);
// @ts-ignore
    get draggable(): boolean;
    set draggable(value: boolean);
// @ts-ignore
    get ios(): any;
}
export declare class Polyline extends PolylineBase {
    private _ios;
    private _color;
    constructor();
// @ts-ignore
    get clickable(): boolean;
    set clickable(value: boolean);
// @ts-ignore
    get zIndex(): number;
    set zIndex(value: number);
    loadPoints(): void;
    reloadPoints(): void;
// @ts-ignore
    get width(): number;
    set width(value: number);
// @ts-ignore
    get color(): Color;
    set color(value: Color);
// @ts-ignore
    get geodesic(): boolean;
    set geodesic(value: boolean);
// @ts-ignore
    get ios(): any;
}
export declare class Polygon extends PolygonBase {
    private _ios;
    private _strokeColor;
    private _fillColor;
    constructor();
// @ts-ignore
    get clickable(): boolean;
    set clickable(value: boolean);
// @ts-ignore
    get zIndex(): number;
    set zIndex(value: number);
    loadPoints(): void;
    loadHoles(): void;
    reloadPoints(): void;
    reloadHoles(): void;
// @ts-ignore
    get strokeWidth(): number;
    set strokeWidth(value: number);
// @ts-ignore
    get strokeColor(): Color;
    set strokeColor(value: Color);
// @ts-ignore
    get fillColor(): Color;
    set fillColor(value: Color);
// @ts-ignore
    get ios(): any;
}
export declare class Circle extends CircleBase {
    private _ios;
    private _center;
    private _strokeColor;
    private _fillColor;
    constructor();
// @ts-ignore
    get clickable(): boolean;
    set clickable(value: boolean);
// @ts-ignore
    get zIndex(): number;
    set zIndex(value: number);
// @ts-ignore
    get center(): Position;
    set center(value: Position);
// @ts-ignore
    get radius(): number;
    set radius(value: number);
// @ts-ignore
    get strokeWidth(): number;
    set strokeWidth(value: number);
// @ts-ignore
    get strokeColor(): Color;
    set strokeColor(value: Color);
// @ts-ignore
    get fillColor(): Color;
    set fillColor(value: Color);
// @ts-ignore
    get ios(): any;
}
