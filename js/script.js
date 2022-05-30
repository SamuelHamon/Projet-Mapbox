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

    $("#map").css("max-width", $("#intro").css("width"));
    $(window).resize(function () {
        $("#map").css("max-width", $("#intro").css("width"));
        window.setTimeout(() => map.resize());
    });

    $("#ui-id-1").css("max-width", $("#search").css("width"));
    $(window).resize(function () {
        $("#ui-id-1").css("max-width", $("#search").css("width"));
    });

    $("#search").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "https://recherche-entreprises.api.gouv.fr/search?" + $("#search").val(),
                data: {
                    q: request.term
                },
                dataType: "json",
                success: function (data) {
                    response($.map(data.results, function (item) {
                        if (item.nom_raison_sociale == null) {
                            var label = item.nom_complet + " - " + item.siege.code_postal + " - " + item.siege.libelle_commune;
                        } else {
                            var label = item.nom_raison_sociale + " - " + item.siege.code_postal + " - " + item.siege.libelle_commune;
                        }
                        var adresse = ""
                        if (item.siege.numero_voie != null){
                            adresse += item.siege.numero_voie + " "
                        }
                        if (item.siege.type_voie != null){
                            adresse += item.siege.type_voie + " "
                        }
                        if (item.siege.libelle_voie != null){
                            adresse += item.siege.libelle_voie
                        }
                        return {
                            label: label,
                            nom_raison_sociale: item.nom_raison_sociale,
                            nom_complet: item.nom_complet,
                            code_postal: item.siege.code_postal,
                            libelle_commune: item.siege.libelle_commune,
                            adresse: adresse,
                            siren: item.siren,
                            siret: item.siege.siret,
                            activite_principale: item.activite_principale,
                            nature_juridique: item.nature_juridique,
                            categorie_entreprise: item.categorie_entreprise,
                            etat_administratif : item.etat_administratif,
                            date_creation: item.date_creation,
                            date_mise_a_jour: item.date_mise_a_jour,
                            latitude: item.siege.latitude,
                            longitude: item.siege.longitude,
                            nombre_etablissements: item.nombre_etablissements,
                            nombre_etablissements_ouverts: item.nombre_etablissements_ouverts
                        };
                    }));
                }
            });
        },
        select: function (event, ui) {
            var datas = {
                "Raison sociale": ui.item.nom_raison_sociale,
                "Nom complet": ui.item.nom_complet,
                "Code postal": ui.item.code_postal,
                "Libelle commune": ui.item.libelle_commune,
                "Adresse": ui.item.adresse,
                "Siren": ui.item.siren,
                "Siret": ui.item.siret,
                "Activite_principale": ui.item.activite_principale,
                "Nature juridique": ui.item.nature_juridique,
                "Categorie entreprise": ui.item.categorie_entreprise,
                "Etat administratif": ui.item.etat_administratif,
                "Date creation": ui.item.date_creation,
                "Nombre d'établissements": ui.item.nombre_etablissements,
                "Nombre d'établissements ouverts": ui.item.nombre_etablissements_ouverts
            };

            var infos = "";

            for (var key in datas) {
                var value = datas[key];
                if (value != null && value != "") {
                    infos += key + " : <b>" + value + "</b><br>";
                }
            }

            infos += "<small>Mise à jour le : " + ui.item.date_mise_a_jour + "</small>";

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