NativeScript plugin for the Google Maps SDK
================

### This is a cross-platform (iOS & Android) Nativescript plugin for the [Google Maps API](https://developers.google.com/maps/).
===
>### This project is a fork from [dapriett/nativescript-google-maps-sdk](https://github.com/dapriett/nativescript-google-maps-sdk) I've created it beaucse of the owner doesn't mantain it often.

>This version include the new maps Renderer for android that Google Maps just [annonce it](https://developers.google.com/maps/documentation/android-sdk/renderer)

![NPM version](https://img.shields.io/badge/npm-1.0.4-green)

[npm-url]: https://www.npmjs.com/package/@kefah/nativescript-google-maps
[npm-image]: https://www.npmjs.com/package/@kefah/nativescript-google-maps.svg

[![NPM](https://nodei.co/npm/nativescript-google-maps-sdk.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@kefah/nativescript-google-maps)

Prerequisites
===
**iOS** - [Cocoapods](https://guides.cocoapods.org/using/getting-started.html#getting-started) must be installed.

**Android** - The latest version of the [Google Play Services SDK](https://developer.android.com/sdk/installing/adding-packages.html) must be installed.

**Google Maps API Key** - Visit the [Google Developers Console](https://console.developers.google.com), create a project, and enable the `Google Maps Android API` and `Google Maps SDK for iOS` APIs.  Then, under credentials, create an API key.

Installation
===

Install the plugin using the NativeScript CLI tooling:

```bash
tns plugin add @kefah/nativescript-google-maps
```

Setup
===

### Demo
Please clone [this plugin demo](https://github.com/kefahB/packages) and go to tools/assets/App_Resources/Android/src/main/res/values/nativescript_google_maps_api.xml and change Your_KEY by your real google maps key.

Then run npm start and choose apps.demo-angular.android for Angular or whatever your technologie...
 
## Configure API Key for Android

### Nativescript < 4

Start by copying the necessary template resource files in to the Android app resources folder:

```bash
cp -r node_modules/nativescript-google-maps-sdk/platforms/android/res/values app/App_Resources/Android/
```
Next, modify your `app/App_Resources/Android/values/nativescript_google_maps_api.xml` file by uncommenting the `nativescript_google_maps_api_key` string, and replace `PUT_API_KEY_HERE` with the API key you created earlier.

Finally, modify your `app/App_Resources/Android/AndroidManifest.xml` file by inserting the following in between the `<application>` tags:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="@string/nativescript_google_maps_api_key" />
```

### Nativescript 4+

Start by copying the necessary template resource files in to the Android app resources folder:

```bash
cp -r node_modules/nativescript-google-maps-sdk/platforms/android/res/values app/App_Resources/Android/src/main/res
```

Next, modify your `app/App_Resources/Android/src/main/res/values/nativescript_google_maps_api.xml` file by uncommenting the `nativescript_google_maps_api_key` string, and replace `PUT_API_KEY_HERE` with the API key you created earlier.

Finally, modify your `app/App_Resources/Android/src/main/AndroidManifest.xml` file by inserting the following in between your `<application>` tags:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="@string/nativescript_google_maps_api_key" />
```

The plugin will default to the latest available version of the Google Play Services SDK for Android.  If you need to change the version, you can add a `project.ext` property, `googlePlayServicesVersion`, like so:

```ts
//   /app/App_Resources/Android/app.gradle

project.ext {
    googlePlayServicesVersion = "+"
}
```

## Configure API Key for iOS

In your `app.js`, use the following code to add your API key (replace `PUT_API_KEY_HERE` with the API key you created earlier):

```ts
if (application.ios) {
    GMSServices.provideAPIKey("PUT_API_KEY_HERE");
}
```
If you are using Angular, modify your `app.module.ts` as follows:
```ts
import * as platform from "platform";
declare var GMSServices: any;

....

if (platform.isIOS) { 
    GMSServices.provideAPIKey("PUT_API_KEY_HERE");
}
```

##  Adding the MapView

Modify your view by adding the `xmlns:maps="nativescript-google-maps-sdk"` namespace to your `<Page>` tag, then use the `<maps:mapView />` tag to create the MapView:

```xml
<!-- /app/main-page.xml -->

<Page xmlns="http://schemas.nativescript.org/tns.xsd"
xmlns:lm="@kefah/nativescript-google-maps" navigatingTo="navigatingTo"  loaded="pageLoaded" class="page">
    <Page.actionBar>
        <ActionBar title="nativescript-google-maps" icon="" class="action-bar">
        </ActionBar>
    </Page.actionBar>
    <GridLayout>
        <lm:GoogleMaps
        latitude="{{ latitude }}" longitude="{{ longitude }}"
			zoom="{{ zoom }}" minZoom="{{ minZoom }}" maxZoom="{{ maxZoom }}"
			tilt="{{ tilt }}" bearing="{{ bearing }}"
			mapAnimationsEnabled="{{ mapAnimationsEnabled }}"
			i-padding="50,50,50,50" padding="{{ padding }}"
			mapReady="onMapReady"
			coordinateTapped="onCoordinateTapped"
			markerSelect="onMarkerEvent"
			markerBeginDragging="onMarkerEvent" markerEndDragging="onMarkerEvent" markerDrag="onMarkerEvent"
			markerInfoWindowTapped="onMarkerEvent" markerInfoWindowClosed="onMarkerEvent"
			cameraChanged="onCameraChanged"
			cameraMove="onCameraMove"
			indoorBuildingFocused="onIndoorBuildingFocused"
			indoorLevelActivated="onIndoorLevelActivated">
        </lm:GoogleMaps>
    </GridLayout>
</Page>
```

## Properties

The following properties are available for adjusting the camera view:

| Property     | Description and Data Type
:------------- | :---------------------------------
`latitude` | Latitude, in degrees: `number`
`longitude` | Longitude, in degrees: `number`
`zoom` | Zoom level (described [here](https://developers.google.com/maps/documentation/javascript/tutorial#zoom-levels)): `number`
`bearing` | Bearing, in degrees: `number`
`tilt` | Tilt, in degrees: `number`
`padding` | Top, bottom, left and right padding amounts, in Device Independent Pixels: `number[]` (array)
`mapAnimationsEnabled` | Whether or not to animate camera changes: `Boolean`

## Events

The following events are available:

| Event        | Description
:------------- | :---------------------------------
`mapReady` | Fires when the MapView is ready for use
`myLocationTapped` | Fires when the 'My Location' button is tapped
`coordinateTapped` | Fires when a coordinate is tapped on the map
`coordinateLongPress` | Fires when a coordinate is long-pressed on the map
`markerSelect` | Fires when a marker is selected
`markerBeginDragging` | Fires when a marker begins dragging
`markerEndDragging` | Fires when a marker ends dragging
`markerDrag` | Fires repeatedly while a marker is being dragged
`markerInfoWindowTapped` | Fires when a marker's info window is tapped
`markerInfoWindowClosed` | Fires when a marker's info window is closed
`shapeSelect` | Fires when a shape (e.g., `Circle`, `Polygon`, `Polyline`) is selected *(Note: you must explicity configure `shape.clickable = true;` for this event to fire)*
`cameraChanged` | Fires after the camera has changed
`cameraMove` | Fires repeatedly while the camera is moving
`indoorBuildingFocused` | Fires when a building is focused on (the building currently centered, selected by the user or by the location provider)
`indoorLevelActivated` | Fires when the level of the focused building changes

## Native Map Object

The MapView's `gMap` property gives you access to the platform's native map object–––consult the appropriate SDK reference on how to use it: [iOS](https://developers.google.com/maps/documentation/ios-sdk/reference/interface_g_m_s_map_view) | [Android](https://developers.google.com/android/reference/com/google/android/gms/maps/GoogleMap)

## UI Settings

You can adjust the map's UI settings after the `mapReady` event has fired by configuring the following properties on `mapView.settings`:

| Property       | Description and Data Type
:--------------- |:---------------------------------
`compassEnabled` | Whether the compass is enabled or not: `Boolean`
`indoorLevelPickerEnabled` | Whether the indoor level picker is enabled or not: `Boolean`
`mapToolbarEnabled` | ** **Android only** ** Whether the map toolbar is enabled or not: `Boolean`
`myLocationButtonEnabled` | Whether the 'My Location' button is enabled or not: `Boolean`
`rotateGesturesEnabled` | Whether the compass is enabled or not: `Boolean`
`scrollGesturesEnabled` | Whether map scroll gestures are enabled or not: `Boolean`
`tiltGesturesEnabled` | Whether map tilt gestures are enabled or not: `Boolean`
`zoomGesturesEnabled` | Whether map zoom gestures are enabled or not: `Boolean`
`zoomControlsEnabled` | ** **Android only** ** Whether map zoom controls are enabled or not: `Boolean`

## Styling

Use `gMap.setStyle(style);` to set the map's styling ([Google Maps Style Reference](https://developers.google.com/maps/documentation/android-api/style-reference) | [Styling Wizard](https://mapstyle.withgoogle.com/)).

### Angular

Use `this.mapView.setStyle(<Style>JSON.parse(this.styles));` inside of the `onMapReady` event handler.  In this example, `this.mapView` is the `MapView` object and `this.styles` is a reference to a JSON file that was created using the [Styling Wizard](https://mapstyle.withgoogle.com/). The `<Style>` type was imported from the plugin as `{ Style }`.

## Basic Example

```ts
//  /app/main-page.js
import { Observable, EventData, Page, Color, Application } from '@nativescript/core';
import { DemoSharedNativescriptGoogleMaps } from '@demo/shared';
import { Bounds, Circle, GoogleMaps, Marker, Polygon, Polyline, Position } from '@kefah/nativescript-google-maps';
import * as permissions from "nativescript-permissions";
let mapView = null;

let vmModule: DemoModel;
let style = require('./map-style.json');

export function navigatingTo(args: EventData) {
    requestPermissions()
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
    vmModule = page.bindingContext;
}

export function onMapReady(args) {
    mapView = args.object;

    console.log("onMapReady");
    mapView.settings.compassEnabled = true;
    mapView.settings.myLocationButtonEnabled = true;

    console.log("Setting a marker...");
    let marker = new Marker();
    marker.position = Position.positionFromLatLng(-33.86, 151.20);
    marker.title = "Sydney";
    marker.snippet = "Australia";
    marker.color = "green";
    marker.userData = {index: 1};
    marker.draggable = true;
    mapView.addMarker(marker);
}

```

## Custom Info Windows (Beta)

To use custom marker info windows, define a template in your view like so:

```xml
<!-- /app/main-page.xml -->
<Page xmlns="http://schemas.nativescript.org/tns.xsd"
xmlns:lm="@kefah/nativescript-google-maps" navigatingTo="navigatingTo"  loaded="pageLoaded" class="page">
    <Page.actionBar>
        <ActionBar title="nativescript-google-maps" icon="" class="action-bar">
        </ActionBar>
    </Page.actionBar>
    <GridLayout>
        <lm:GoogleMaps
        latitude="{{ latitude }}" longitude="{{ longitude }}"
			zoom="{{ zoom }}" minZoom="{{ minZoom }}" maxZoom="{{ maxZoom }}"
			tilt="{{ tilt }}" bearing="{{ bearing }}"
			mapAnimationsEnabled="{{ mapAnimationsEnabled }}"
			i-padding="50,50,50,50" padding="{{ padding }}"
			mapReady="onMapReady"
			coordinateTapped="onCoordinateTapped"
			markerSelect="onMarkerEvent"
			markerBeginDragging="onMarkerEvent" markerEndDragging="onMarkerEvent" markerDrag="onMarkerEvent"
			markerInfoWindowTapped="onMarkerEvent" markerInfoWindowClosed="onMarkerEvent"
			cameraChanged="onCameraChanged"
			cameraMove="onCameraMove"
			indoorBuildingFocused="onIndoorBuildingFocused"
			indoorLevelActivated="onIndoorLevelActivated">
            <lm:GoogleMaps.infoWindowTemplate>
                <StackLayout orientation="vertical" width="200" >
                    <Label text="{{title}}" className="title" width="125"   />
                    <Label text="{{snippet}}" className="snippet" width="125"   />
                    <Label text="{{'LAT: ' + position.latitude}}" className="infoWindowCoordinates"  />
                    <Label text="{{'LON: ' + position.longitude}}" className="infoWindowCoordinates"  />
                </StackLayout>
            </lm:GoogleMaps.infoWindowTemplate>
        </lm:GoogleMaps>
    </GridLayout>
</Page>
```

...and set the `infoWindowTemplate` property like so:

```ts
var marker = new mapsModule.Marker();
marker.infoWindowTemplate = 'testWindow';
```

This will configure the marker to use the info window template with the given key.  If no template with that key is found, then it will use the default info window template.

** *Known issue:* remote images fail to display in iOS info windows (local images work fine)

## Usage with Angular

See Angular demo code included [here](https://github.com/kefahB/nativescript-google-maps.git/tree/master/ng-demo)


# Clustering Support (Issue [#57](https://github.com/dapriett/nativescript-google-maps-sdk/issues/57))

There is a seperate plugin in development thanks to [@naderio](https://github.com/naderio): see [nativescript-google-maps-utils](https://github.com/naderio/nativescript-google-maps-utils).

# Get Help

Checking with the Nativescript community is your best bet for getting help.

If you have a question, start by seeing if anyone else has encountered the scenario on [Stack Overflow](http://stackoverflow.com/questions/tagged/nativescript). If you cannot find any information, try [asking the question yourself](http://stackoverflow.com/questions/ask/advice?). Make sure to add any details needed to recreate the issue and include the “NativeScript” and "google-maps" tags, so your question is visible to the NativeScript community.


Finally, if you have found an issue with the NativeScript Google Maps SDK itself, or requesting a new feature, please report them here [Issues](https://github.com/kefahB/nativescript-google-maps.git/issues).
