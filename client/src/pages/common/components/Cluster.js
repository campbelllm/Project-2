import React from 'react';
import mapboxgl from 'mapbox-gl';
import API from '../../../utils/API';
import './TestSite.css';
import virusImg from '../../../virus.png'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

class Cluster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: -122.59179687498357,
            lat: 37.66995747013945,
            zoom: 4,
            // bounds: [-122.517910874663, 37.6044780500533, -122.354995082683, 37.8324430069081],
            points: [],
        };
    }
    loadAPI = async () => {
        return await API.newMarkers()
    };



    async componentDidMount() {
        const coords = await this.loadAPI();

        let positionArray = []

        coords.map(coordinate => positionArray.push(
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [coordinate.longitude, coordinate.latitude] }, "properties": { "name": coordinate.name } }));

        // this line sets position array as the array 'coords' in our state
        this.setState({ points: positionArray })

        console.log('array', positionArray)

        const points = this.state.points;
        // This function creates the map for the component to render later
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
            // maxBounds: this.state.bounds
        });
        // This function controls the top sidebar, sharing the user's coordinates and zoom
        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });

        map.on('load', function () {
            console.log(points)
            // Add a new source from our GeoJSON data and
            // set the 'cluster' option to true. GL-JS will
            // add the point_count property to your source data.
            map.addSource('covidPoints', {
                type: 'geojson',
                // Point to GeoJSON data. This example visualizes all M1.0+ covidPoints
                // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                data: {
                    "type": "FeatureCollection",
                    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                    "features": points
                },
                cluster: true,
                clusterMaxZoom: 15, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });

            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'covidPoints',
                filter: ['has', 'point_count'],
                paint: {
                    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                    // with three steps to implement three types of circles:
                    //   * Blue, 20px circles when point count is less than 100
                    //   * Yellow, 30px circles when point count is between 100 and 750
                    //   * Pink, 40px circles when point count is greater than or equal to 750
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        'green',
                        3,
                        'orange',
                        7,
                        'red'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40
                    ]
                }
            });

            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'covidPoints',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });

            map.loadImage(
                virusImg,
                function (error, image) {
                    if (error) throw error;
                    map.addImage('virus', image);
                    map.addLayer({
                        id: 'unclustered-point',
                        type: 'symbol',
                        source: 'covidPoints',
                        filter: ['!', ['has', 'point_count']],
                        layout: {
                            'icon-image': 'virus',
                            'icon-size': 0.15
                        }
                    });
                }
            );

            // inspect a cluster on click
            map.on('click', 'clusters', function (e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });
                var clusterId = features[0].properties.cluster_id;
                map.getSource('covidPoints').getClusterExpansionZoom(
                    clusterId,
                    function (err, zoom) {
                        if (err) return;

                        map.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom
                        });
                    }
                );
            });

            // When a click event occurs on a feature in
            // the unclustered-point layer, open a popup at
            // the location of the feature, with
            // description HTML from its properties.
            map.on('click', 'unclustered-point', function (e) {
                // console.log('e', e.features[0].properties)
                var coordinates = e.features[0].geometry.coordinates.slice();
                var name = e.features[0].properties.name;

                // Ensure that if the map is zoomed out such that
                // multiple copies of the feature are visible, the
                // popup appears over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(
                        '<br>' + name
                    )
                    .addTo(map);
            });

            map.on('mouseenter', 'clusters', function () {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'clusters', function () {
                map.getCanvas().style.cursor = '';
            });
        });
    };
    // The rendering of the following containers requires the css file, to render properly
    render() {
        return (
            <div>
                <h2>INFECTED LOCATIONS</h2>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
                <div ref={el => this.mapContainer = el} className='mapContainer' />
            </div>
        )
    }
}

export default Cluster;
