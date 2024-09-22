import wixData, { filter, sort } from 'wix-data';
import wixLocation from 'wix-location';
import { members } from 'wix-members.v2';
import { getBrand, getModel, getYearList } from 'backend/advertListing';
const ALL = 'Hepsi';
const RESET_ALL = 'RESET_ALL';

$w.onReady(function () {
  loadBrands();
  loadYear();
  applyVehicleFilters();
  applyRealEstateFilters();
  applyProductFilters();
});

let filters = {};
let sortBy = '';
// VEHICLE FILTER
$w('#vehicleReset').onClick(() => {
  filters = {};
  applyVehicleFilters();
});

$w('#brandDropdown').onChange(() => {
  const selectedBrand = $w('#brandDropdown').value;
  loadModels(selectedBrand);
  if (selectedBrand === ALL) {
    delete filters['selectedBrand'];
  } else {
    filters['selectedBrand'] = selectedBrand;
  }
  applyVehicleFilters();
});

$w('#vehicleSortByDate').onChange((event) => {
  sortBy = event.target.value;
  applyVehicleFilters();
});

$w('#vehicleSortByPrice').onChange((event) => {
  sortBy = event.target.value;
  applyVehicleFilters();
});

$w('#modelDropdown').onChange(() => {
  const selectedModel = $w('#modelDropdown').value;
  if (selectedModel === ALL) {
    delete filters['selectedModel'];
  } else {
    filters['selectedModel'] = selectedModel;
  }
  applyVehicleFilters();
});
$w('#aracMinimumFiyat').onChange(() => {
  const minimumPrice = parseInt($w('#aracMinimumFiyat').value);

  if (minimumPrice !== 0 || minimumPrice !== null) {
    filters['aracMinimumFiyat'] = minimumPrice;
    applyVehicleFilters();
  } else {
    delete filters['aracMinimumFiyat'];
  }
});

$w('#aracMaksimumFiyat').onChange((event) => {
  const maxPrice = parseInt(event.target.value);
  if (maxPrice !== 0 || maxPrice !== null) {
    filters['aracMaksimumFiyat'] = maxPrice;
    applyVehicleFilters();
  } else {
    delete filters['aracMaksimumFiyat'];
  }
});

$w('#aracCityDropdown').onChange(() => {
  const city = $w('#aracCityDropdown').value;
  if (city === RESET_ALL) {
    delete filters['city'];
  } else {
    filters['city'] = city;
  }
  applyVehicleFilters();
});
// REAL ESTATE FILTER
$w('#reReset').onClick(() => {
  filters = {};
  applyRealEstateFilters();
});

$w('#reSortByDate').onChange((event) => {
  sortBy = event.target.value;
  applyRealEstateFilters();
});

$w('#reSortByPrice').onChange((event) => {
  sortBy = event.target.value;
  applyRealEstateFilters();
});

$w('#rentOrSaleDropdown').onChange(() => {
  const selectedType = $w('#rentOrSaleDropdown').value;
  filters['rentorSale'] = selectedType;
  applyRealEstateFilters();
});

$w('#reCityDropdown').onChange(() => {
  const city = $w('#reCityDropdown').value;
  if (city === RESET_ALL) {
    delete filters['city'];
  } else {
    filters['city'] = city;
  }

  applyRealEstateFilters();
});
$w('#reKonutTipiDropdown').onChange(() => {
  const konutTipi = $w('#reKonutTipiDropdown').value;
  filters['konuttipitag'] = konutTipi;
  applyRealEstateFilters();
});
$w('#emlakMinimumFiyat').onChange(() => {
  const minimumPrice = parseInt($w('#emlakMinimumFiyat').value);

  if (minimumPrice !== 0 || minimumPrice !== null) {
    filters['emlakMinimumFiyat'] = minimumPrice;
    applyRealEstateFilters();
  } else {
    delete filters['emlakMinimumFiyat'];
  }
});

$w('#emlakMaksimumFiyat').onChange((event) => {
  const maxPrice = parseInt(event.target.value);
  if (maxPrice !== 0 || maxPrice !== null) {
    filters['emlakMaksimumFiyat'] = maxPrice;
    applyRealEstateFilters();
  } else {
    delete filters['emlakMaksimumFiyat'];
  }
});

$w('#odaSayisi').onChange(() => {
  const odaSayisi = $w('#odaSayisi').value;

  filters['odasayisitag'] = odaSayisi;
  applyRealEstateFilters();
});

$w('#banyoSayisi').onChange(() => {
  const banyoSayisi = $w('#banyoSayisi').value;

  filters['banyosayisitag'] = banyoSayisi;
  applyRealEstateFilters();
});
$w('#konutKat').onChange(() => {
  const konutKat = $w('#konutKat').value;

  filters['konutkatitag'] = konutKat;
  applyRealEstateFilters();
});
$w('#esyaDurumu').onChange(() => {
  const esyaDurumu = $w('#esyaDurumu').value;

  filters['esyadurumutag'] = esyaDurumu;
  applyRealEstateFilters();
});
$w('#binaOzellikleri').onChange(() => {
  const binaOzellikleri = $w('#binaOzellikleri').value;

  filters['binaOzellikleriTags'] = binaOzellikleri;
  applyRealEstateFilters();
});

// PRODUCT
$w('#prdReset').onClick(() => {
  filters = {};
  applyProductFilters();
});
$w('#prdCityDropdown').onChange(() => {
  const city = $w('#prdCityDropdown').value;
  if (city === RESET_ALL) {
    delete filters['city'];
  } else {
    filters['city'] = city;
  }
  applyProductFilters();
});

$w('#prdSortByDate').onChange((event) => {
  sortBy = event.target.value;
  applyProductFilters();
});

$w('#prdSortByPrice').onChange((event) => {
  sortBy = event.target.value;
  applyProductFilters();
});
$w('#prdCategory').onChange(() => {
  const category = $w('#prdCategory').value;
  filters['kategori'] = category;
  applyProductFilters();
});

$w('#prdCondition').onChange((event) => {
  const condition = event.target.value;
  filters['urunKondisyon'] = condition;
  applyProductFilters();
});

$w('#prdMinimumFiyat').onChange(() => {
  const minimumPrice = parseInt($w('#prdMinimumFiyat').value);

  if (minimumPrice !== 0 || minimumPrice !== null) {
    filters['prdMinimumFiyat'] = minimumPrice;
    applyProductFilters();
  } else {
    delete filters['prdMinimumFiyat'];
  }
});

$w('#prdMaksimumFiyat').onChange((event) => {
  const maxPrice = parseInt(event.target.value);
  if (maxPrice !== 0 || maxPrice !== null) {
    filters['prdMaksimumFiyat'] = maxPrice;
    applyProductFilters();
  } else {
    delete filters['prdMaksimumFiyat'];
  }
});

function buildOptions(items) {
  return items.map((item) => ({
    label: item.toString(),
    value: item.toString(),
  }));
}

async function loadBrands() {
  const results = await getBrand();
  const items = [ALL, ...results.items];
  const brandsList = buildOptions(items);
  $w('#brandDropdown').options = brandsList;
}

async function loadModels(brand) {
  const results = await getModel(brand);
  const items = [{ model: ALL }, ...results.items];
  const modelsList = buildOptions(items.map((item) => item.model));
  $w('#modelDropdown').options = modelsList;
}
async function loadYear() {
  const results = await getYearList();
  const items = [ALL, ...results.items];

  const yearList = buildOptions(items);
  $w('#aracyili').options = yearList;
}
$w('#aracyakitturu').onChange(() => addFilterParam('aracyakitturu'));
$w('#aracsanziman').onChange(() => addFilterParam('aracsanziman'));
$w('#arackondisyon').onChange(() => addFilterParam('arackondisyon'));
$w('#aracvites').onChange(() => addFilterParam('aracvites'));
$w('#aracyili').onChange(() => addFilterParam('aracyili'));

function addFilterParam(type) {
  let selectedValues;

  switch (type) {
    case 'aracyili':
      selectedValues = parseInt($w(`#${type}`).value);
      break;
    default:
      selectedValues = $w(`#${type}`).value;
      break;
  }
  filters[type] = selectedValues;
  applyVehicleFilters();
}

function applyFilter(collectionName) {
  let query = wixData.query(collectionName);
  for (let filter in filters) {
    if (filters[filter].length > 0) {
      query = query.hasSome(filter, filters[filter]);
    }
    if (filter === 'aracyili') {
      query = query.ge('aracyili', filters[filter]);
    }
    if (filter === 'aracMinimumFiyat' && !filters['aracMaksimumFiyat']) {
      query = query.gt('fiyat', filters[filter]);
    }
    if (filter === 'aracMaksimumFiyat' && !filters['aracMinimumFiyat']) {
      query = query.lt('fiyat', filters[filter]);
    }
    if (filters['aracMinimumFiyat'] && filters['aracMaksimumFiyat']) {
      query = query.between('fiyat', filters['aracMinimumFiyat'], filters['aracMaksimumFiyat']);
    }

    if (filter === 'emlakMinimumFiyat' && !filters['emlakMaksimumFiyat']) {
      query = query.gt('price', filters[filter]);
    }

    if (filter === 'emlakMaksimumFiyat' && !filters['emlakMinimumFiyat']) {
      query = query.lt('price', filters[filter]);
    }
    if (filters['emlakMinimumFiyat'] && filters['emlakMaksimumFiyat']) {
      query = query.between('price', filters['emlakMinimumFiyat'], filters['emlakMaksimumFiyat']);
    }

    if (filter === 'prdMinimumFiyat' && !filters['prdMaksimumFiyat']) {
      query = query.gt('fiyaturun', filters[filter]);
    }
    if (filter === 'prdMaksimumFiyat' && !filters['prdMinimumFiyat']) {
      query = query.lt('fiyaturun', filters[filter]);
    }
    if (filters['prdMinimumFiyat'] && filters['prdMaksimumFiyat']) {
      query = query.between('fiyaturun', filters['prdMinimumFiyat'], filters['prdMaksimumFiyat']);
    }
  }
  return query;
}

function formatPrice(rawPrice) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(rawPrice);
}

function applyProductFilters() {
  let query = applyFilter('Urun');
  switch (sortBy) {
    case 'a_z':
      query = query.ascending('_createdDate');
      break;
    case 'z_a':
      query = query.descending('_createdDate');
      break;
    case '0_9':
      query = query.ascending('fiyaturun');
      break;
    case '9_0':
      query = query.descending('fiyaturun');
      break;
    default:
      break;
  }

  if (Object.keys(filters).length) {
    $w('#prdReset').show();
  } else {
    $w('#prdReset').hide();
  }
  query.find().then((results) => {
    $w('#prdRepeater').data = results.items;
    $w('#prdRepeater').forEachItem(($item, itemData) => {
      $item('#prdTitle').text = itemData.title;
      $item('#prdDescription').text = itemData.description;
      $item('#prdPrice').text = formatPrice(itemData.fiyaturun);
      $item('#prdCity').text = itemData.city;
      $item('#prdSubTitle').text = itemData.kategori;
      $item('#prdImage').src = itemData.image;
      $item('#prdItem').onClick((e) => {
        wixLocation.to(itemData['link-urun-title']);
      });
      members
        .getMember(itemData.publicProfile, {})
        .then((member) => {
          $item('#prdOwnerName').text = member.profile.nickname;
          $item('#prdOwnerAvatar').src = member.profile.photo.url;
        })
        .catch((error) => {
          console.error('members error', error);
        });
    });
  });
}

function applyRealEstateFilters() {
  let query = applyFilter('Emlak');
  switch (sortBy) {
    case 'a_z':
      query = query.ascending('_createdDate');
      break;
    case 'z_a':
      query = query.descending('_createdDate');
      break;
    case '0_9':
      query = query.ascending('price');
      break;
    case '9_0':
      query = query.descending('price');
      break;
    default:
      break;
  }
  if (Object.keys(filters).length) {
    $w('#reReset').show();
  } else {
    $w('#reReset').hide();
  }

  query.find().then((results) => {
    $w('#reRepeater').data = results.items;
    $w('#reRepeater').forEachItem(($item, itemData) => {
      $item('#reTitle').text = itemData.title;
      $item('#reDescription').text = itemData.description;
      $item('#reCity').text = itemData.city;
      $item('#rePrice').text = formatPrice(itemData.price);
      $item('#rentOrSale').text = itemData.rentorSale;
      $item('#reImage').src = itemData.image;
      $item('#reSubTitle').text =
        `${itemData.konuttipitag} - ${itemData.odasayisitag} oda ${itemData.banyosayisitag} banyo`;
      $item('#reItem').onClick((e) => {
        wixLocation.to(itemData['link-emlak-title-2']);
      });

      members
        .getMember(itemData.publicProfile, {})
        .then((member) => {
          $item('#reOwnerName').text = member.profile.nickname;
          $item('#reOwnerAvatar').src = member.profile.photo.url;
        })
        .catch((error) => {
          console.error('members error', error);
        });
    });
  });
}

function applyVehicleFilters() {
  let query = applyFilter('araba');
  switch (sortBy) {
    case 'a_z':
      query = query.ascending('aracyili');
      break;
    case 'z_a':
      query = query.descending('aracyili');
      break;
    case '0_9':
      query = query.ascending('fiyat');
      break;
    case '9_0':
      query = query.descending('fiyat');
      break;
    default:
      break;
  }

  if (Object.keys(filters).length) {
    $w('#vehicleReset').show();
  } else {
    $w('#vehicleReset').hide();
  }
  query
    .find()
    .then((results) => {
      $w('#vehicleRepeater').data = results.items;
      $w('#vehicleRepeater').forEachItem(($item, itemData) => {
        $item('#vehicleMeta').text =
          `${itemData.selectedBrand} - ${itemData.selectedModel} ${itemData.aracsanziman} ${itemData.aracyakitturu}`;
        $item('#vehicleTitle').text = itemData.title;
        $item('#vehiclePrice').text = formatPrice(itemData.fiyat);
        $item('#vehicleCity').text = itemData.city;
        $item('#vehicleDescription').text = itemData.description;
        $item('#vehicleThumbnail').src = itemData.image;
        $item('#vehicleMilage').text = `${itemData.arackilometre.toLocaleString()} km`;
        $item('#vehicleItem').onClick((e) => {
          wixLocation.to(itemData['link-araba-title']);
        });
        members
          .getMember(itemData.publicProfile, {})
          .then((member) => {
            $item('#vehicleSellerName').text = member.profile.nickname;
            $item('#vehicleSellerAvatar').src = member.profile.photo.url;
          })
          .catch((error) => {
            console.error('members error', error);
          });
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

/**
*	Adds an event handler that runs when the tabs element moves to a different tab.
	[Read more](https://www.wix.com/corvid/reference/$w.Tabs.html#onChange)
*	 @param {$w.Event} event
*/
export function tabsChange(event) {
  filters = {};
  sortBy = '';
  // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
  // Add your code for this event here:
}
