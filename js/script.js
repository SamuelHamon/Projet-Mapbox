$(document).ready(function () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtdWVsNzgiLCJhIjoiY2t6OHVkcjBnMWg3dTJ1dXNzbno0dWJwNCJ9.wxWIMK-g6Pg1wQ1Q_BERgQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2.213749, 46.227638],
        zoom: 5
    });
    map.addControl(new mapboxgl.NavigationControl());

    const layerList = document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');

    for (const input of inputs) {
        input.onclick = (layer) => {
            const layerId = layer.target.id;
            map.setStyle('mapbox://styles/mapbox/' + layerId);
        };
    }

    $("#search").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "https://entreprise.data.gouv.fr/api/sirene/v1/full_text/" + $("#search").val(),
                data: {
                    q: request.term
                },
                dataType: "json",
                success: function (data) {
                    response($.map(data.etablissement, function (item) {
                        if (item.l2_normalisee != null) {
                            var label = item.nom_raison_sociale + " (" + item.l2_normalisee + ") - " + item.code_postal + " - " + item.libelle_commune;
                        } else {
                            var label = item.nom_raison_sociale + " - " + item.code_postal + " - " + item.libelle_commune;
                        }
                        return {
                            label: label,
                            nom_raison_sociale: item.nom_raison_sociale,
                            code_postal: item.code_postal,
                            libelle_commune: item.libelle_commune,
                            geo_l4: item.geo_l4,
                            libelle_region: item.libelle_region,
                            siret: item.siret,
                            siren: item.siren,
                            libelle_activite_principale: item.libelle_activite_principale,
                            libelle_nature_juridique_entreprise: item.libelle_nature_juridique_entreprise,
                            categorie_entreprise: item.categorie_entreprise,
                            date_creation: item.date_creation,
                            updated_at: item.updated_at,
                            latitude: item.latitude,
                            longitude: item.longitude
                        };
                    }));
                }
            });
        },
        select: function (event, ui) {

            var date = ui.item.date_creation;
            var d = date.substring(6, 8);
            var m = date.substring(4, 6);
            var y = date.substring(0, 4);
            var formattedDate = d + "/" + m + "/" + y;

            var infos = "Nom : <b>" + ui.item.nom_raison_sociale + "</b><br>Adresse : <b>" + ui.item.geo_l4 + "</b><br>Commune : <b>" + ui.item.libelle_commune +
                "</b><br>Code postal : <b>" + ui.item.code_postal + "</b><br>Région : <b>" + ui.item.libelle_region +
                "</b><br>Activité principale : <b>" + ui.item.libelle_activite_principale + "</b><br>Nature juridique entreprise : <b>" + ui.item.libelle_nature_juridique_entreprise +
                "</b><br>Catégorie entreprise : <b>" + ui.item.categorie_entreprise + "</b><br>Date création : <b>" + formattedDate +
                "</b><br><small>Mise à jour le : " + ui.item.updated_at + "</small>";

            marker(ui.item.latitude, ui.item.longitude, infos);
        }
    });

    function marker(lat, lon, infos) {
        var popup = new mapboxgl.Popup({
            offset: 25
        }).setHTML(infos);

        var el = document.createElement('div');
        el.id = 'marker';

        new mapboxgl.Marker(el)
            .setLngLat([lon, lat])
            .setPopup(popup)
            .addTo(map);

        map.flyTo({
            center: [lon, lat - 0.05],
            zoom: 10
        });
    }
});