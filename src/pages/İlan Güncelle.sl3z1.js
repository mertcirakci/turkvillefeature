import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixWindow from 'wix-window';
import { currentMember } from 'wix-members-frontend';
import { members } from 'wix-members.v2';
// Tab Identifier
const TYPES = {
  PRODUCT: 'urun',
  VEHICLE: 'araba',
  REAL_ESTATE: 'ilan',
};
// Wix DB Names
const COLLECTIONS = {
  PRODUCT: 'Urun',
  VEHICLE: 'araba',
  REAL_ESTATE: 'Emlak',
};

let selectedItem = {};

$w.onReady(async function () {
  let mID = '';

  if (wixUsers.currentUser.loggedIn) {
    let use_id = await wixUsers.currentUser.id;
    mID = use_id;
    updateRepeaterData(TYPES.REAL_ESTATE, mID);
    updateRepeaterData(TYPES.VEHICLE, mID);
    updateRepeaterData(TYPES.PRODUCT, mID);
  } else {
    console.error('User is not logged in');
  }
  // Delete buttons
  $w('#productDelete').onClick(() => handleProductDelete(TYPES.PRODUCT, mID));
  $w('#vehicleDelete').onClick(() => handleProductDelete(TYPES.VEHICLE, mID));
  $w('#realEstateDelete').onClick(() => handleProductDelete(TYPES.REAL_ESTATE, mID));
  // Update buttons
  $w('#productUpdate').onClick(() => handleUpdate(TYPES.PRODUCT, mID));
  $w('#vehicleUpdate').onClick(() => handleUpdate(TYPES.VEHICLE, mID));
  $w('#realEstateUpdate').onClick(() => handleUpdate(TYPES.REAL_ESTATE, mID));
  // Tab click
  $w('#homecontainer').onClick(() => handleContainerClick('home'));
  $w('#salecontainer').onClick(() => handleContainerClick('arac'));
  $w('#itemcontainer').onClick(() => handleContainerClick('urun'));
  // Sidebar item click
  $w('#productRepeater').onItemReady(handleProductRepeater);
  $w('#vehicleRepeater').onItemReady(handleVehicleRepeater);
  $w('#realEstateRepeater').onItemReady(handleRealEstateRepeater);
});

async function handleProductDelete(type, mID) {
  if (selectedItem?.id) {
    const res = await wixWindow.openLightbox('LightboxPage', {
      type,
      selectedItem,
    });
    updateRepeaterData(type, mID);
    console.info('selected item', 'res', res, selectedItem, ' type', type);
  } else {
    console.error('No item selected for deletion.');
  }
}

async function handleUpdate(type, mID) {
  if (!selectedItem?.id) {
    console.error('No item selected for update.');
    return;
  }

  let collectionName;
  switch (type) {
    case TYPES.PRODUCT:
      collectionName = COLLECTIONS.PRODUCT;
      break;
    case TYPES.VEHICLE:
      collectionName = COLLECTIONS.VEHICLE;
      break;
    case TYPES.REAL_ESTATE:
      collectionName = COLLECTIONS.REAL_ESTATE;
      break;
    default:
      console.error('Product type does not match');
      return;
  }
  // Wix doesn't support put or patch therefore get current item and update the
  let currentItem = await wixData.get(collectionName, selectedItem.id);
  const updatedFields = await getUpdatedFields(type);
  let updatedItem = {
    ...currentItem,
    // Add other fields here
    ...updatedFields,
  };
  try {
    let results = await wixData.update(collectionName, updatedItem);
    console.log('Item updated successfully', results);
    updateRepeaterData(type, mID);
  } catch (error) {
    console.error('Error updating item', error);
  }
}

async function getUpdatedFields(type) {
  switch (type) {
    case TYPES.PRODUCT:
      let mainimage = null;
      let galleryurun = [];
      const updatedProductPayload = {
        title: $w('#productTitle').value,
        kategori: $w('#productCategory').value,
        fiyaturun: parseInt($w('#productPrice').value),
        address: $w('#productAddress').value,
        urunKondisyon: $w('#productCondition').value,
        city: $w('#productAddress').value.city,
        description: $w('#productDescription').value,
      };
      if ($w('#productMainImage').value.length) {
        mainimage = await $w('#productMainImage').startUpload();
        updatedProductPayload.image = mainimage.url;
      }
      if ($w('#productImageGallery').value.length) {
        console.log('ana productImageGallery here ', $w('#productImageGallery').value);
        await $w('#productImageGallery')
          .uploadFiles()
          .then((uploadedFiles) => {
            uploadedFiles.forEach((uploadedFile) => {
              galleryurun.push({
                src: uploadedFile.fileUrl,
                slug: uploadedFile.fileName,
                type: 'image',
                title: uploadedFile.fileName,
                settings: {
                  width: uploadedFile.width,
                  height: uploadedFile.height,
                },
              });
            });
            updatedProductPayload.galleryurun = galleryurun;
          })
          .catch((uploadError) => {
            let errCode = uploadError.errorCode; // 7751
            let errDesc = uploadError.errorDescription; // "Error description"
          });
      }
      return updatedProductPayload;

    case TYPES.VEHICLE:
      let vehicleMainImage = null;
      let vehicleGallery = [];

      const vehiclePayload = {
        selectedBrand: $w('#vehicleBrand').value,
        selectedModel: $w('#vehicleModel').value,
        aracvites: $w('#vehicleTransmission').value,
        arackondisyon: $w('#vehicleCondition').value,
        aracsanziman: $w('#vehicleBody').value,
        aracyakitturu: $w('#vehicleFuelType').value,
        title: $w('#vehicleTitle').value,
        aracyili: parseInt($w('#vehicleYear').value),
        arackilometre: parseInt($w('#vehicleMilage').value),
        description: $w('#vehicleDescription').value,
        address: $w('#vehicleAdress').value,
        city: $w('#vehicleAdress').value.city,
        fiyat: parseInt($w('#vehiclePrice').value),
      };

      if ($w('#vehicleMainImage').value.length) {
        vehicleMainImage = await $w('#vehicleMainImage').startUpload();
        vehiclePayload.image = vehicleMainImage.url;
      }
      if ($w('#vehicleGalery').value.length) {
        await $w('#vehicleGalery')
          .uploadFiles()
          .then((uploadedFiles) => {
            uploadedFiles.forEach((uploadedFile) => {
              vehicleGallery.push({
                src: uploadedFile.fileUrl,
                slug: uploadedFile.fileName,
                type: 'image',
                title: uploadedFile.fileName,
                settings: {
                  width: uploadedFile.width,
                  height: uploadedFile.height,
                },
              });
            });
            vehiclePayload.aracMediaGallery = vehicleGallery;
          })
          .catch((uploadError) => {
            let errCode = uploadError.errorCode; // 7751
            let errDesc = uploadError.errorDescription; // "Error description"
          });
      }
      return vehiclePayload;
    case TYPES.REAL_ESTATE:
      let realEstateMainImage = null;
      let realEstateGallery = [];
      const realEstatePayload = {
        rentorSale: $w('#realEstateRentorSale').value,
        konuttipitag: $w('#realEstateType').value,
        odasayisitag: $w('#realEstateNumberOfRoom').value,
        konutkatitag: $w('#realEstateLevel').value,
        esyadurumutag: $w('#realEstateFurniture').value,
        banyosayisitag: $w('#realEstateNumberOfBathroom').value,
        binaOzellikleriTags: $w('#realEstateAvailability').value,
        title: $w('#realEstateTitle').value,
        description: $w('#realEstateDescription').value,
        address: $w('#realEstateAddress').value,
        city: $w('#realEstateAddress').value.city,
        price: parseInt($w('#realEstatePrice').value),
      };
      if ($w('#realEstateImage').value.length) {
        realEstateMainImage = await $w('#realEstateImage').startUpload();
        realEstatePayload.image = realEstateMainImage.url;
      }
      if ($w('#realEstateGallery').value.length) {
        await $w('#realEstateGallery')
          .uploadFiles()
          .then((uploadedFiles) => {
            uploadedFiles.forEach((uploadedFile) => {
              realEstateGallery.push({
                src: uploadedFile.fileUrl,
                slug: uploadedFile.fileName,
                type: 'image',
                title: uploadedFile.fileName,
                settings: {
                  width: uploadedFile.width,
                  height: uploadedFile.height,
                },
              });
            });
            realEstatePayload.gallery = realEstateGallery;
          })
          .catch((uploadError) => {
            let errCode = uploadError.errorCode; // 7751
            let errDesc = uploadError.errorDescription; // "Error description"
          });
      }
      return realEstatePayload;
    default:
      console.error('Product type does not match');
      return;
  }
}

function handleContainerClick(state) {
  console.log(state);
  $w('#multiStateBox1').changeState(state);
}

function handleProductRepeater($item, itemData) {
  $item('#productLink').onClick(() => {
    selectedItem = { id: itemData._id, title: itemData.title };
    $w('#productTitle').value = itemData.title;
    ($w('#productCondition').value = itemData.urunKondisyon),
      ($w('#productCategory').value = itemData.kategori);
    $w('#productPrice').value = itemData.fiyaturun;
    $w('#productAddress').value = itemData.address;
    $w('#productDescription').value = itemData.description;
  });
}

function handleVehicleRepeater($item, itemData) {
  $item('#vehicleLink').onClick(() => {
    console.log('ITEMDATA', itemData);
    selectedItem = { id: itemData._id, title: itemData.title };
    $w('#vehicleBrand').value = itemData.selectedBrand;
    loadModels(itemData.selectedBrand);
    $w('#vehicleModel').value = itemData.selectedModel;
    $w('#vehicleTransmission').value = itemData.aracvites;
    $w('#vehicleCondition').value = itemData.arackondisyon;
    $w('#vehicleBody').value = itemData.aracsanziman;
    $w('#vehicleFuelType').value = itemData.aracyakitturu;
    $w('#vehicleTitle').value = itemData.title;
    $w('#vehicleYear').value = itemData.aracyili;
    $w('#vehicleMilage').value = itemData.arackilometre;
    $w('#vehicleDescription').value = itemData.description;
    $w('#vehicleAdress').value = itemData.address;
    $w('#vehiclePrice').value = itemData.fiyat;
  });
}
// Handle brand/model dropdown change
$w('#vehicleBrand').onChange((event) => {
  let selectedBrand = $w('#vehicleBrand').value;
  loadModels(selectedBrand);
});

function buildOptions(items) {
  return items.map((currentItem) => {
    return {
      label: currentItem,
      value: currentItem,
    };
  });
}
async function loadModels(brand) {
  await wixData
    .query('VehicleInfo')
    .eq('brand', brand)
    .find()
    .then((results) => {
      let modelsList = buildOptions(results.items.map((item) => item.model));
      $w('#vehicleModel').options = modelsList;
    });
}
function handleRealEstateRepeater($item, itemData) {
  $item('#realEstateLink').onClick(() => {
    selectedItem = {
      id: itemData._id,
      title: itemData.title,
    };
    $w('#realEstateRentorSale').value = itemData.rentorSale;
    $w('#realEstateType').value = itemData.konuttipitag;
    $w('#realEstateNumberOfRoom').value = itemData.odasayisitag;
    $w('#realEstateLevel').value = itemData.konutkatitag;
    $w('#realEstateFurniture').value = itemData.esyadurumutag;
    $w('#realEstateNumberOfBathroom').value = itemData.banyosayisitag;
    $w('#realEstateAvailability').value = itemData.binaOzellikleriTags;
    $w('#realEstateTitle').value = itemData.title;
    $w('#realEstateDescription').value = itemData.description;
    $w('#realEstateAddress').value = itemData.address;
    $w('#realEstatePrice').value = itemData.price;
  });
}
async function updateRepeaterData(type = null, mID) {
  let query, repeater, link;
  switch (type) {
    case TYPES.PRODUCT:
      query = wixData.query(COLLECTIONS.PRODUCT);
      repeater = $w('#productRepeater');
      link = '#productLink';
      break;
    case TYPES.REAL_ESTATE:
      query = wixData.query(COLLECTIONS.REAL_ESTATE);
      repeater = $w('#realEstateRepeater');
      link = '#realEstateLink';
      break;
    case TYPES.VEHICLE:
      console.log('vehicle repeater');
      query = wixData.query(COLLECTIONS.VEHICLE);
      repeater = $w('#vehicleRepeater');
      link = '#vehicleLink';
      break;
    default:
      console.error('Product type does not match');
      return;
  }

  try {
    let results = await query.find();
    const filterPromises = results.items.map(getItemsFilteredByOwner);
    const filterResults = await Promise.all(filterPromises);
    const filteredItems = results.items.filter((item, index) => filterResults[index]);
    repeater.data = filteredItems;
    repeater.onItemReady(($item, itemData, index) => {
      $item(link).label = itemData.title;
    });
  } catch (error) {
    console.error(error);
  }
}
async function getItemsFilteredByOwner(item) {
  const currMember = await currentMember.getMember();
  const itemOwner = await members.getMember(item.publicProfile, {});
  return itemOwner._id === currMember._id;
}
