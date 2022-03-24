import {
    GoogleMapsCommon, BoundsBase, CircleBase,
    MarkerBase, PolygonBase, PolylineBase, ProjectionBase,
    PositionBase, ShapeBase, latitudeProperty, VisibleRegionBase,
    longitudeProperty, bearingProperty, zoomProperty,
    tiltProperty, UISettingsBase, getColorHue
} from "./common";
import {StyleBase} from "./index";
import { GC, layout } from "@nativescript/core/utils"
import { Image, Color, ImageSource } from "@nativescript/core";
import { Point } from "@nativescript/core/ui/core/view";


declare function UIEdgeInsetsMake(...params: any[]): any;
@NativeClass
class IndoorDisplayDelegateImpl extends NSObject implements GMSIndoorDisplayDelegate {

    public static ObjCProtocols = [GMSIndoorDisplayDelegate];

    private _owner: WeakRef<GoogleMaps>;

    public static initWithOwner(owner: WeakRef<GoogleMaps>): IndoorDisplayDelegateImpl {
        let handler = <IndoorDisplayDelegateImpl>IndoorDisplayDelegateImpl.new();
        handler._owner = owner;
        return handler;
    }

    public didChangeActiveBuilding(indoorBuilding: GMSIndoorBuilding): void {
        let owner = this._owner.get();
        if (owner) {
            let data = null;
            if (indoorBuilding) {
                const levels = [];
                let count = 0;

                while (count < indoorBuilding.levels.count) {
                    levels.push(
                        {
                            name: indoorBuilding.levels[count].name,
                            shortName: indoorBuilding.levels[count].shortName,
                        }
                    );
                    count += 1;
                }

                data = {
                    defaultLevelIndex: indoorBuilding.defaultLevelIndex,
                    levels: levels,
                    isUnderground: indoorBuilding.underground,
                };
            }
            owner.notifyBuildingFocusedEvent(data);
        }
    }

    public didChangeActiveLevel(activateLevel: GMSIndoorLevel): void {
        let owner = this._owner.get();
        if (owner) {
            let data = null;
            if (activateLevel) {
                data = {
                    name: activateLevel.name,
                    shortName: activateLevel.shortName,
                };
            }
            owner.notifyIndoorLevelActivatedEvent(data);
        }
    }
}

@NativeClass
class MapViewDelegateImpl extends NSObject implements GMSMapViewDelegate {

    public static ObjCProtocols = [GMSMapViewDelegate];

    private _owner: WeakRef<GoogleMaps>;

    public static initWithOwner(owner: WeakRef<GoogleMaps>): MapViewDelegateImpl {
        let handler = <MapViewDelegateImpl>MapViewDelegateImpl.new();
        handler._owner = owner;
        return handler;
    }

    public mapViewIdleAtCameraPosition(mapView: GMSMapView, cameraPosition: GMSCameraPosition): void {
        let owner = this._owner.get();
        if (owner) {

            owner._processingCameraEvent = true;

            let cameraChanged: boolean = false;
            if (owner.latitude != cameraPosition.target.latitude) {
                cameraChanged = true;
                latitudeProperty.nativeValueChange(owner, cameraPosition.target.latitude);
            }
            if (owner.longitude != cameraPosition.target.longitude) {
                cameraChanged = true;
                longitudeProperty.nativeValueChange(owner, cameraPosition.target.longitude);
            }
            if (owner.bearing != cameraPosition.bearing) {
                cameraChanged = true;
                bearingProperty.nativeValueChange(owner, cameraPosition.bearing);
            }
            if (owner.zoom != cameraPosition.zoom) {
                cameraChanged = true;
                zoomProperty.nativeValueChange(owner, cameraPosition.zoom);
            }
            if (owner.tilt != cameraPosition.viewingAngle) {
                cameraChanged = true;
                tiltProperty.nativeValueChange(owner, cameraPosition.viewingAngle);
            }

            if (cameraChanged) {
                owner.notifyCameraEvent(GoogleMapsCommon.cameraChangedEvent, {
                    latitude: cameraPosition.target.latitude,
                    longitude: cameraPosition.target.longitude,
                    zoom: cameraPosition.zoom,
                    bearing: cameraPosition.bearing,
                    tilt: cameraPosition.viewingAngle
                });
            }

            owner._processingCameraEvent = false;
        }
    }

    public mapViewDidChangeCameraPosition(mapView: GMSMapView, cameraPosition: GMSCameraPosition) {
        let owner = this._owner.get();
        owner.notifyCameraEvent(GoogleMapsCommon.cameraMoveEvent, {
            latitude: cameraPosition.target.latitude,
            longitude: cameraPosition.target.longitude,
            zoom: cameraPosition.zoom,
            bearing: cameraPosition.bearing,
            tilt: cameraPosition.viewingAngle
        });
    }

    public mapViewDidTapAtCoordinate(mapView: GMSMapView, coordinate: CLLocationCoordinate2D): void {
        let owner = this._owner.get();
        if (owner) {
            let position: Position = Position.positionFromLatLng(coordinate.latitude, coordinate.longitude);
            owner.notifyPositionEvent(GoogleMapsCommon.coordinateTappedEvent, position);
        }
    }

    public mapViewDidLongPressAtCoordinate(mapView: GMSMapView, coordinate: CLLocationCoordinate2D): void {
        let owner = this._owner.get();
        if (owner) {
            let position: Position = Position.positionFromLatLng(coordinate.latitude, coordinate.longitude);
            owner.notifyPositionEvent(GoogleMapsCommon.coordinateLongPressEvent, position);
        }
    }

    public mapViewDidTapMarker(mapView: GMSMapView, gmsMarker: GMSMarker): boolean {
        const owner = this._owner.get();
        if (owner) {
            // @ts-ignore
            let marker: Marker = owner.findMarker((marker: Marker) => marker.ios == gmsMarker);
            if (marker) {
                owner.notifyMarkerTapped(marker);
            }
        }
        return false;
    }

    public mapViewDidTapOverlay(mapView: GMSMapView, gmsOverlay: GMSOverlay): void {
        let owner = this._owner.get();
        if (owner) {
            let shape: ShapeBase = owner.findShape((shape: ShapeBase) => shape.ios == gmsOverlay);
            if (shape) {
                owner.notifyShapeTapped(shape);
            }
        }
    }
    public mapViewDidBeginDraggingMarker(mapView: GMSMapView, gmsMarker: GMSMarker): void {
        let owner = this._owner.get();
        if (owner) {
            // @ts-ignore
            let marker: Marker = owner.findMarker((marker: Marker) => marker.ios == gmsMarker);
            owner.notifyMarkerBeginDragging(marker);
        }
    }

    public mapViewDidEndDraggingMarker(mapView: GMSMapView, gmsMarker: GMSMarker): void {
        let owner = this._owner.get();
        if (owner) {
            // @ts-ignore
            let marker: Marker = owner.findMarker((marker: Marker) => marker.ios == gmsMarker);
            owner.notifyMarkerEndDragging(marker);
        }
    }

    public mapViewDidDragMarker(mapView: GMSMapView, gmsMarker: GMSMarker): void {
        let owner = this._owner.get();
        if (owner) {
            // @ts-ignore
            let marker: Marker = owner.findMarker((marker: Marker) => marker.ios == gmsMarker);
            owner.notifyMarkerDrag(marker);
        }
    }

    public mapViewDidTapInfoWindowOfMarker(mapView: GMSMapView, gmsMarker: GMSMarker): void {
        let owner = this._owner.get();
        if (owner) {
            // @ts-ignore
            let marker: Marker = owner.findMarker((marker: Marker) => marker.ios == gmsMarker);
            owner.notifyMarkerInfoWindowTapped(marker);
        }
    }

    public mapViewDidCloseInfoWindowOfMarker(mapView: GMSMapView, gmsMarker: GMSMarker): void {
        let owner = this._owner.get();
        if (owner) {
            // @ts-ignore
            let marker: Marker = owner.findMarker((marker: Marker) => marker.ios == gmsMarker);
            owner.notifyMarkerInfoWindowClosed(marker);
        }
    }

    public didTapMyLocationButtonForMapView(mapView: GMSMapView): boolean {
        const owner = this._owner.get();
        if (owner) {
            console.log("didTapMyLocationButtonForMapViewàà")
            owner.bearing = 33;
            owner.notifyMyLocationTapped();
            return false;
        }
        return true;
    }

    public mapViewDidTapMyLocation(mapView: GMSMapView, location: CLLocationCoordinate2D): void {
        const owner = this._owner.get();
        if (owner) {
            console.log("mapViewDidTapMyLocation")
        }
    }

    public mapViewMarkerInfoWindow(mapView: GMSMapView, gmsMarker: GMSMarker): UIView {
        return null;
    }

    public mapViewMarkerInfoContents(mapView: GMSMapView, gmsMarker: GMSMarker): UIView {
        let owner = this._owner.get();
        if (!owner) return null;
        // @ts-ignore
        let marker: Marker = owner.findMarker((marker: Marker) => marker.ios == gmsMarker);
        var content = owner._getMarkerInfoWindowContent(marker);
  
        if (content) {
            let width = Number(content.width);
            if (Number.isNaN(width)) width = null;
            let height = Number(content.height);
            if (Number.isNaN(height)) height = null;

            if (!height || !width) {
                const bounds: CGRect = UIScreen.mainScreen.bounds;
                width = width || (bounds.size.width * .7);
                height = height || (bounds.size.height * .4);
            }

            this._layoutRootView(content, CGRectMake(0, 0, width, height))
            return content.ios;
        }

        return null;
    }

    /*
        Replacement for _layoutRootView method removed in NativeScript 6
    */
    private _layoutRootView(rootView, parentBounds) {
        if (!rootView || !parentBounds) {
            return;
        }

        const size = parentBounds.size;
        const width = layout.toDevicePixels(size.width);
        const height = layout.toDevicePixels(size.height);

        const widthSpec = layout.makeMeasureSpec(width, layout.EXACTLY);
        const heightSpec = layout.makeMeasureSpec(height, layout.EXACTLY);

        rootView.measure(widthSpec, heightSpec);

        const origin = parentBounds.origin;
        const left = origin.x;
        const top = origin.y;

        rootView.layout(left, top, width, height);
    }
}


@NativeClass
class CLLocationManagerDelegateImpl extends NSObject implements CLLocationManagerDelegate {
    public static ObjCProtocols = [CLLocationManagerDelegate];

    public _owner: WeakRef<GGMLocationMnager>;

    public static initWithOwner(owner: WeakRef<GGMLocationMnager>): CLLocationManagerDelegateImpl {
        let handler = CLLocationManagerDelegateImpl.new() as CLLocationManagerDelegateImpl;
        handler._owner = owner
        console.log("CLLocationManagerDelegateImpl:initWithOwner")
        return handler;
    }

    public locationManagerDidChangeAuthorization(cclm: CLLocationManager) {
        let owner = this._owner.get();
        console.log("CLLocationManagerDelegateImpl:locationManagerDidChangeAuthorization")
        owner.requestAlwaysAuthorization()
        console.log(cclm.location)
    }

    public locationManagerDidUpdateLocations(manager: CLLocationManager, locations: NSArray<CLLocation> | CLLocation[]): void {
        let owner = this._owner.get();
        console.log("CLLocationManagerDelegateImpl:locationManagerDidUpdateLocations")
        console.log(locations)
    }

    public locationManagerDidUpdateToLocationFromLocation(manager: CLLocationManager, newLocation: CLLocation, oldLocation: CLLocation): void {
        let owner = this._owner.get();
        console.log("CLLocationManagerDelegateImpl:locationManagerDidUpdateToLocationFromLocation")
        console.log(newLocation)
    }

}

@NativeClass
class GGMLocationMnager extends CLLocationManager {

    public _delegate:CLLocationManagerDelegateImpl;
    private locationManager: CLLocationManager;

    constructor() {
        super()
        console.log("GGMLocationMnager")
        this.locationManager = CLLocationManager.new();
        this._delegate = CLLocationManagerDelegateImpl.initWithOwner(new WeakRef(this));
        this.locationManager.delegate = this._delegate;
        console.log('desiredAccuracy', this.locationManager.desiredAccuracy = kCLLocationAccuracyBest)
        console.log('locationServicesEnabled', this.locationManager.locationServicesEnabled)
        this.requestWhenInUseAuthorization();
        console.log('authorizationStatus', this.locationManager.authorizationStatus)
        this.locationManager.startUpdatingLocation();
        console.log(this.locationManager.location)
    }


    public requestWhenInUseAuthorization() {
        this.locationManager.requestWhenInUseAuthorization()
    }

}

export abstract class GoogleMaps extends GoogleMapsCommon {
    
    protected _markers: Array<Marker> = new Array<Marker>();

    private _delegate: MapViewDelegateImpl;
    private _indoorDelegate:IndoorDisplayDelegateImpl;
    locationManager: GGMLocationMnager;

    constructor() {
        super();
        this.nativeView = GMSMapView.mapWithFrameCamera(CGRectZero, this._createCameraPosition());
        this._delegate = MapViewDelegateImpl.initWithOwner(new WeakRef(this));
        this._indoorDelegate = IndoorDisplayDelegateImpl.initWithOwner(new WeakRef(this));
        //this.locationManager = new GGMLocationMnager();
        //console.log(this.locationManager.authorizationStatus)
        this.updatePadding();
    }

    public onLoaded() {
        super.onLoaded();
        this.nativeView.delegate = this._delegate;
        this.nativeView.indoorDisplay.delegate = this._indoorDelegate;
        this.notifyMapReady();
    }

    public onUnloaded() {
        this.nativeView.delegate = null;
        this.nativeView.indoorDisplay.delegate = null;
        super.onUnloaded();
    }

    public disposeNativeView() {
        this._markers = null;
        this._delegate = null;
        this._indoorDelegate=null;
        super.disposeNativeView();
        GC();
    };

    private _createCameraPosition() {
        return GMSCameraPosition.cameraWithLatitudeLongitudeZoomBearingViewingAngle(
            this.latitude,
            this.longitude,
            this.zoom,
            this.bearing,
            this.tilt
        );
    }

    updateCamera() {
        if (this.mapAnimationsEnabled) {
            this.nativeView.animateToCameraPosition(this._createCameraPosition());
        } else {
            this.nativeView.camera = this._createCameraPosition();
        }
    }

    setViewport(bounds: Bounds, padding?: number) {
        var p = UIEdgeInsetsMake(padding, padding, padding, padding) || this.gMap.padding;
        let cameraPosition = this.nativeView.cameraForBoundsInsets(bounds.ios, p);

        if (this.mapAnimationsEnabled) {
            this.nativeView.animateToCameraPosition(cameraPosition);
        } else {
            this.nativeView.camera = cameraPosition;
        }
    }

    updatePadding() {
        if (this.padding) {
            this.gMap.padding = UIEdgeInsetsMake(
                this.padding[0] || 0,
                this.padding[2] || 0,
                this.padding[1] || 0,
                this.padding[3] || 0
            );
        }
    }

    // @ts-ignore
    get ios(): never {
        throw new Error('Now use instance.nativeView instead of instance.ios');
    }

    get gMap() {
        return this.nativeView;
    }

    // @ts-ignore
    get projection(): Projection {
        return new Projection(this.nativeView.projection);
    }

    // @ts-ignore
    get settings(): UISettings {
        return (this.nativeView) ? new UISettings(this.nativeView.settings) : null;
    }

    // @ts-ignore
    get myLocationEnabled(): boolean {
        return (this.nativeView) ? this.nativeView.myLocationEnabled : false;
    }

    set myLocationEnabled(value: boolean) {
        if (this.nativeView) this.nativeView.myLocationEnabled = value;
    }

    setMinZoomMaxZoom() {
        this.gMap.setMinZoomMaxZoom(this.minZoom, this.maxZoom);
    }

    addMarker(...markers: Marker[]) {
        if(!markers || !this._markers || !this.gMap) return null;
        markers.forEach(marker => {
            marker.ios.map = this.gMap;
            this._markers.push(marker);
        });
    }

    removeMarker(...markers: Marker[]) {
        if(!markers || !this._markers || !this.gMap) return null;
        markers.forEach(marker => {
            this._unloadInfoWindowContent(marker);
            marker.ios.map = null;
            this._markers.splice(this._markers.indexOf(marker), 1);
        });
    }

    removeAllMarkers() {
        if(!this._markers) return null;
        this._markers.forEach(marker => {
            this._unloadInfoWindowContent(marker);
            marker.ios.map = null;
        });
        this._markers = [];
    }

    findMarker(callback: (marker: Marker) => boolean): Marker {
        if(!this._markers) return null;
        return this._markers.find(callback);
    }

    addPolyline(shape: Polyline) {
        if(!this._shapes) return null;
        shape.loadPoints();
        shape.ios.map = this.gMap;
        this._shapes.push(shape);
    }

    addPolygon(shape: Polygon) {
        if(!this._shapes) return null;
        shape.ios.map = this.gMap;
        this._shapes.push(shape);
    }

    addCircle(shape: Circle) {
        if(!this._shapes) return null;
        shape.ios.map = this.gMap;
        this._shapes.push(shape);
    }

    removeShape(shape: ShapeBase) {
        if(!this._shapes) return null;
        shape.ios.map = null;
        this._shapes.splice(this._shapes.indexOf(shape), 1);
    }

    removeAllShapes() {
        if(!this._shapes) return null;
        this._shapes.forEach(shape => {
            shape.ios.map = null;
        });
        this._shapes = [];
    }

    findShape(callback: (shape: ShapeBase) => boolean): ShapeBase {
        if(!this._shapes) return null;
        return this._shapes.find(callback);
    }

    clear() {
        this._markers = [];
        this.nativeView.clear();
    }

    setStyle(style: StyleBase) {
        try {
            this.nativeView.mapStyle = GMSMapStyle.styleWithJSONStringError(JSON.stringify(style));
            return true;
        } catch (err) {
            return false;
        }
    }
}



export class UISettings extends UISettingsBase {
    private _ios: any;

    get ios() {
        return this._ios;
    }

    constructor(ios: any) {
        super();
        this._ios = ios;
    }

    // @ts-ignore
    get compassEnabled(): boolean {
        return this._ios.compassButton;
    }

    set compassEnabled(value: boolean) {
        this._ios.compassButton = value;
    }

    // @ts-ignore
    get indoorLevelPickerEnabled(): boolean {
        return this._ios.indoorPicker;
    }

    set indoorLevelPickerEnabled(value: boolean) {
        this._ios.indoorPicker = value;
    }

    // @ts-ignore
    get mapToolbarEnabled(): boolean {
        return false;
    }

    set mapToolbarEnabled(value: boolean) {
        if (value) console.warn("Map toolbar not available on iOS");
    }

    // @ts-ignore
    get myLocationButtonEnabled(): boolean {
        return this._ios.myLocationButton;
    }

    set myLocationButtonEnabled(value: boolean) {
        this._ios.myLocationButton = value;
    }

    // @ts-ignore
    get rotateGesturesEnabled(): boolean {
        return this._ios.rotateGestures;
    }

    set rotateGesturesEnabled(value: boolean) {
        this._ios.rotateGestures = value;
    }

    // @ts-ignore
    get scrollGesturesEnabled(): boolean {
        return this._ios.scrollGestures;
    }

    set scrollGesturesEnabled(value: boolean) {
        this._ios.scrollGestures = value;
    }

    // @ts-ignore
    get tiltGesturesEnabled(): boolean {
        return this._ios.tiltGestures;
    }

    set tiltGesturesEnabled(value: boolean) {
        this._ios.tiltGestures = value;
    }

    // @ts-ignore
    get zoomControlsEnabled(): boolean {
        return false;
    }

    set zoomControlsEnabled(value: boolean) {
        if (value) console.warn("Zoom controls not available on iOS");
    }

    // @ts-ignore
    get zoomGesturesEnabled(): boolean {
        return this._ios.zoomGestures;
    }

    set zoomGesturesEnabled(value: boolean) {
        this._ios.zoomGestures = value;
    }
}

export class Projection extends ProjectionBase {
    private _ios: any; /* GMSProjection */

    // @ts-ignore
    get ios() {
        return this._ios;
    }

    // @ts-ignore
    get visibleRegion(): VisibleRegion {
        return new VisibleRegion(this.ios.visibleRegion());
    }

    fromScreenLocation(point: Point) {
        var location = this.ios.coordinateForPoint(CGPointMake(point.x, point.y));
        return new Position(location);
    }

    toScreenLocation(position: Position) {
        var cgPoint = this.ios.pointForCoordinate(position.ios);
        return {
            x: cgPoint.x,
            y: cgPoint.y
        };
    }

    constructor(ios: any) {
        super();
        this._ios = ios;
    }
}

export class VisibleRegion extends VisibleRegionBase {
    private _ios: any; /* GMSVisibleRegion */
    get ios() {
        return this._ios;
    }

    // @ts-ignore
    get nearLeft(): Position {
        return new Position(this.ios.nearLeft);
    }

    // @ts-ignore
    get nearRight(): Position {
        return new Position(this.ios.nearRight);
    }

    // @ts-ignore
    get farLeft(): Position {
        return new Position(this.ios.farLeft);
    }

    // @ts-ignore
    get farRight(): Position {
        return new Position(this.ios.farRight);
    }

    // @ts-ignore
    get bounds(): Bounds {
        return new Bounds(GMSCoordinateBounds.alloc().initWithRegion(this.ios));
    }

    constructor(ios: any) {
        super();
        this._ios = ios;
    }
}

export class Bounds extends BoundsBase {
    private _ios: GMSCoordinateBounds;

    // @ts-ignore
    get ios() {
        return this._ios;
    }

    // @ts-ignore
    get southwest() {
        return new Position(this.ios.southWest);
    }

    // @ts-ignore
    get northeast() {
        return new Position(this._ios.northEast);
    }

    constructor(ios: GMSCoordinateBounds) {
        super();
        this._ios = ios;
    }

    public static fromCoordinates(southwest: Position, northeast: Position): Bounds {
        return new Bounds(GMSCoordinateBounds.alloc().initWithCoordinateCoordinate(southwest.ios, northeast.ios));
    }
}

export class Position extends PositionBase {
    private _ios: any; /* CLLocationCoordinate2D */

    // @ts-ignore
    get ios() {
        return this._ios;
    }

    // @ts-ignore
    get latitude() {
        return this._ios.latitude;
    }

    set latitude(latitude) {
        this._ios = CLLocationCoordinate2DMake(latitude, this.longitude);
    }

    // @ts-ignore
    get longitude() {
        return this._ios.longitude;
    }

    set longitude(longitude) {
        this._ios = CLLocationCoordinate2DMake(this.latitude, longitude);
    }

    constructor(ios?: CLLocationCoordinate2D) {
        super();
        this._ios = ios || CLLocationCoordinate2DMake(0, 0);
    }

    public static positionFromLatLng(latitude: number, longitude: number): Position {
        let position: Position = new Position();
        position.latitude = latitude;
        position.longitude = longitude;
        return position;
    }
}

export class Marker extends MarkerBase {
    private _ios: any;
    private _color: number;
    private _icon: Image;
    private _alpha = 1;
    private _visible = true;

    private static cachedColorIcons: { [hue: number]: any } = {}

    private static getIconForColor(hue: number) {
        const hueKey = hue.toFixed(8);
        if (!Marker.cachedColorIcons[hueKey]) {
            const icon = GMSMarker.markerImageWithColor(UIColor.colorWithHueSaturationBrightnessAlpha(hue, 1, 1, 1));
            Marker.cachedColorIcons[hueKey] = icon;
        }
        return Marker.cachedColorIcons[hueKey];
    }

    constructor() {
        super();
        this._ios = GMSMarker.new();
    }

    // @ts-ignore
    get position() {
        return new Position(this._ios.position);
    }

    set position(position: Position) {
        this._ios.position = position.ios;
    }

    // @ts-ignore
    get rotation() {
        return this._ios.rotation;
    }

    set rotation(value: number) {
        this._ios.rotation = value;
    }

    // @ts-ignore
    get zIndex() {
        return this._ios.zIndex;
    }

    set zIndex(value: number) {
        this._ios.zIndex = value;
    }

    // @ts-ignore
    get title() {
        return this._ios.title;
    }

    set title(title) {
        this._ios.title = title;
    }

    // @ts-ignore
    get snippet() {
        return this._ios.snippet;
    }

    set snippet(snippet) {
        this._ios.snippet = snippet;
    }

    showInfoWindow(): void {
        this._ios.map.selectedMarker = this._ios;
    }

    isInfoWindowShown(): boolean {
        return this._ios.map.selectedMarker == this._ios;
    }

    hideInfoWindow(): void {
        this._ios.map.selectedMarker = null;
    }

    // @ts-ignore
    get color() {
        return this._color;
    }

    set color(value: Color | string | number) {
        value = getColorHue(value);

        this._color = value;
        if (this._color) {
            this._ios.icon = Marker.getIconForColor(this._color / 360);
        } else {
            this._ios.icon = null;
        }
    }

    // @ts-ignore
    get icon() {
        return this._icon;
    }

    set icon(value: Image | string) {
        if (typeof value === 'string') {
            var tempIcon = new Image();
            tempIcon.imageSource = ImageSource.fromResourceSync(String(value));
            value = tempIcon;
        }
        this._icon = value;
        this._ios.icon = (value) ? this._icon.imageSource.ios : null;
    }

    // @ts-ignore
    get alpha() {
        return this._alpha;
    }

    set alpha(value: number) {
        this._alpha = value;
        if (this._visible) this._ios.opacity = value;
    }

    // @ts-ignore
    get visible() {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
        this._ios.opacity = (this._visible) ? this._alpha : 0;
    }

    // @ts-ignore
    get flat() {
        return this._ios.flat;
    }

    set flat(value: boolean) {
        this._ios.flat = value;
    }

    // @ts-ignore
    get anchor() {
        return [this._ios.groundAnchor.x, this._ios.groundAnchor.y];
    }

    set anchor(value: Array<number>) {
        this._ios.groundAnchor = CGPointMake(value[0], value[1]);
    }

    // @ts-ignore
    get draggable() {
        return this._ios.draggable;
    }

    set draggable(value: boolean) {
        this._ios.draggable = value;
    }

    // @ts-ignore
    get ios() {
        return this._ios;
    }
}

export class Polyline extends PolylineBase {
    private _ios: any;
    private _color: Color;

    constructor() {
        super();
        this._ios = GMSPolyline.new();
        this._points = [];
    }

    // @ts-ignore
    get clickable() {
        return this._ios.tappable;
    }

    set clickable(value: boolean) {
        this._ios.tappable = value;
    }

    // @ts-ignore
    get zIndex() {
        return this._ios.zIndex;
    }

    set zIndex(value: number) {
        this._ios.zIndex = value;
    }

    loadPoints(): void {
        var points = GMSMutablePath.new();
        this._points.forEach(function (point) {
            points.addCoordinate(point.ios);
        }.bind(this));
        this._ios.path = points;
    }

    reloadPoints(): void {
        this.loadPoints();
    }

    // @ts-ignore
    get width() {
        return this._ios.strokeWidth;
    }

    set width(value: number) {
        this._ios.strokeWidth = value;
    }

    // @ts-ignore
    get color() {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
        this._ios.strokeColor = value.ios;
    }

    // @ts-ignore
    get geodesic() {
        return this._ios.geodesic;
    }

    set geodesic(value: boolean) {
        this._ios.geodesic = value;
    }

    // @ts-ignore
    get ios() {
        return this._ios;
    }
}

export class Polygon extends PolygonBase {
    private _ios: any;
    private _strokeColor: Color;
    private _fillColor: Color;

    constructor() {
        super();
        this._ios = GMSPolygon.new();
        this._points = [];
        this._holes = [];
    }

    // @ts-ignore
    get clickable() {
        return this._ios.tappable;
    }

    set clickable(value: boolean) {
        this._ios.tappable = value;
    }

    // @ts-ignore
    get zIndex() {
        return this._ios.zIndex;
    }

    set zIndex(value: number) {
        this._ios.zIndex = value;
    }

    loadPoints(): void {
        var points = GMSMutablePath.new();
        this._points.forEach((point: Position) => {
            points.addCoordinate(point.ios);
        });
        this._ios.path = points;
    }

    loadHoles(): void {
        var holes = [];
        this._holes.forEach((hole: Position[]) => {
            var points = GMSMutablePath.new();
            hole.forEach((point: Position) => {
                points.addCoordinate(point.ios);
            });
            holes.push(points);
        });
        this._ios.holes = holes;
    }

    reloadPoints(): void {
        this.loadPoints();
    }

    reloadHoles(): void {
        this.loadHoles();
    }

    // @ts-ignore
    get strokeWidth() {
        return this._ios.strokeWidth;
    }

    set strokeWidth(value: number) {
        this._ios.strokeWidth = value;
    }

    // @ts-ignore
    get strokeColor() {
        return this._strokeColor;
    }

    set strokeColor(value: Color) {
        this._strokeColor = value;
        this._ios.strokeColor = value.ios;
    }

    // @ts-ignore
    get fillColor() {
        return this._fillColor;
    }

    set fillColor(value: Color) {
        this._fillColor = value;
        this._ios.fillColor = value.ios;
    }

    // @ts-ignore
    get ios() {
        return this._ios;
    }
}

export class Circle extends CircleBase {
    private _ios: any;
    private _center: Position;
    private _strokeColor: Color;
    private _fillColor: Color;

    constructor() {
        super();
        this._ios = GMSCircle.new();
    }

    // @ts-ignore
    get clickable() {
        return this._ios.tappable;
    }

    set clickable(value: boolean) {
        this._ios.tappable = value;
    }

    // @ts-ignore
    get zIndex() {
        return this._ios.zIndex;
    }

    set zIndex(value: number) {
        this._ios.zIndex = value;
    }

    // @ts-ignore
    get center() {
        return this._center;
    }

    set center(value: Position) {
        this._center = value;
        this._ios.position = value.ios;
    }

    // @ts-ignore
    get radius() {
        return this._ios.radius;
    }

    set radius(value: number) {
        this._ios.radius = value;
    }

    // @ts-ignore
    get strokeWidth() {
        return this._ios.strokeWidth;
    }

    set strokeWidth(value: number) {
        this._ios.strokeWidth = value;
    }

    // @ts-ignore
    get strokeColor() {
        return this._strokeColor;
    }

    set strokeColor(value: Color) {
        this._strokeColor = value;
        this._ios.strokeColor = value.ios;
    }

    // @ts-ignore
    get fillColor() {
        return this._fillColor;
    }

    set fillColor(value: Color) {
        this._fillColor = value;
        this._ios.fillColor = value.ios;
    }

    // @ts-ignore
    get ios() {
        return this._ios;
    }
}
