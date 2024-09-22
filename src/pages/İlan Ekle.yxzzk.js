import wixData from 'wix-data';
import { currentMember } from 'wix-members-frontend';

$w.onReady(function () {
  loadBrands();
});

async function loadBrands() {
  await wixData
    .query('VehicleInfo')
    .distinct('brand')
    .then((results) => {
      let brandsList = buildOptions(results);
      $w('#brandsDropdownpage').options = brandsList;
    });
}

function buildOptions(items) {
  return items.map((currentItem) => {
    return {
      label: currentItem,
      value: currentItem,
    };
  });
}

$w('#brandsDropdownpage').onChange((event) => {
  let selectedBrand = $w('#brandsDropdownpage').value;
  loadModels(selectedBrand);
});

async function loadModels(brand) {
  await wixData
    .query('VehicleInfo')
    .eq('brand', brand)
    .find()
    .then((results) => {
      let modelsList = buildOptions(results.items.map((item) => item.model));
      $w('#modelsDropdownpage').options = modelsList;
    });
}

function throwErrorArac(message) {
  $w('#errorMessage').text = message;
  $w('#errorMessage').show();
  $w('#loader').hide();
  $w('#sendButtonArac').enable();
}
$w('#sendButtonArac').onClick(async (event) => {
  $w('#loader').show();
  $w('#sendButtonArac').disable();
  $w('#successMessage').hide();
  $w('#errorMessage').hide();

  const currMember = await currentMember.getMember();
  if (!$w('#aracanagorselpage').value.length) {
    return throwErrorArac('Lutfen ana gorsel ekleyiniz');
  }
  if (!$w('#aractitlepage').value) {
    return throwErrorArac('Lutfen ilan basligi ekleyiniz');
  }
  const mainImage = await $w('#aracanagorselpage').startUpload();

  const gallery = [];
  try {
    const uploadedFiles = await $w('#aracgaleripage').uploadFiles();
    if (uploadedFiles.length) {
      uploadedFiles.forEach((uploadedFile) => {
        gallery.push({
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
    }
  } catch (uploadError) {
    let errCode = uploadError.errorCode; // 7751
    let errDesc = uploadError.errorDescription; // "Error description"
  }
  let title = $w('#aractitlepage').value;
  let aracyili = $w('#aracyilipage').value;
  let description = $w('#aracaciklamapage').value;
  let selectedBrand = $w('#brandsDropdownpage').value;
  let selectedModel = $w('#modelsDropdownpage').value;
  let arackilometre = $w('#arackilometrepage').value;
  let aracvites = $w('#aracvitespage').value;
  let arackondisyonu = $w('#arackondisyonupage').value;
  let aracsanziman = $w('#aracsanzimanpage').value;
  let aracyakitturu = $w('#aracyakitpage').value;
  let fiyat = $w('#aracfiyatpage').value;
  let address = $w('#addressInput1').value;

  let toInsert = {
    title: title,
    image: mainImage.url,
    aracyili: parseInt(aracyili),
    description: description,
    selectedBrand: selectedBrand,
    selectedModel: selectedModel,
    arackilometre: parseInt(arackilometre),
    aracvites: aracvites,
    arackondisyon: arackondisyonu,
    aracyakitturu: aracyakitturu,
    aracsanziman: aracsanziman,
    fiyat: parseInt(fiyat),
    aracMediaGallery: gallery,
    publicProfile: currMember,
    referenceMembers: currMember,
    address: address,
    city: address.city,
  };
  try {
    // Bu kısmı kendi veritabanınızın adıyla değiştirin
    const result = await wixData.insert('araba', toInsert);
    $w('#successMessage').text = `${result.title} ilaniniz basariyla kaydedilmistir`;
    $w('#successMessage').show();
    // Formu gönderdikten sonra yapılacak işlemleri burada ekleyebilirsiniz.
    findIn('#arac').all('TextInput').value = '';
    findIn('#arac').all('Dropdown').value = null;
    findIn('#arac').all('AddressInput').value = null;
    $w('#aracgaleripage').reset();
    $w('#aracanagorselpage').reset();
  } catch (error) {
    $w('#errorMessage').show();
    console.error('Error', error);
  } finally {
    setTimeout(() => {
      $w('#successMessage').hide();
      $w('#sendButtonArac').enable();
      $w('#loader').hide();
    }, 3000);
  }
});
function throwErrorEmlak(message) {
  $w('#emlakErrorMessage').text = message;
  $w('#emlakErrorMessage').show();
  $w('#emlakLoader').hide();
  $w('#sendButtonEmlak').enable();
}
$w('#sendButtonEmlak').onClick(async (event) => {
  $w('#emlakLoader').show();
  $w('#sendButtonEmlak').disable();
  $w('#emlakSuccessMessage').hide();
  $w('#emlakErrorMessage').hide();

  const currMember = await currentMember.getMember();
  if (!$w('#emlakimage').value.length) {
    return throwErrorEmlak('Lutfen ana gorsel ekleyiniz');
  }
  if (!$w('#Emlaktitle').value) {
    return throwErrorEmlak('Lutfen ilan basligi ekleyiniz');
  }

  const image = await $w('#emlakimage').startUpload();

  const gallery = [];
  await $w('#emlakgaleri')
    .uploadFiles()
    .then((uploadedFiles) => {
      uploadedFiles.forEach((uploadedFile) => {
        gallery.push({
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
    })
    .catch((uploadError) => {
      let errCode = uploadError.errorCode; // 7751
      let errDesc = uploadError.errorDescription; // "Error description"
    });
  let title = $w('#Emlaktitle').value;
  let rentorSale = $w('#EmlakrentorSale').value;
  let konuttipitag = $w('#konuttipitag').value;
  let odasayisitag = $w('#odasayisitag').value;
  let konutkatitag = $w('#konutkatitag').value;
  let esyadurumutag = $w('#esyadurumutag').value;
  let banyosayisitag = $w('#banyosayisitag').value;
  let binaOzellikleriTags = $w('#checkboxGroup1').value;
  let description = $w('#Emlakaciklama').value;
  let price = $w('#Emlakfiyat').value;
  let address = $w('#addressInput2').value;

  let toInsert = {
    publicProfile: currMember,
    referenceMembers: currMember,
    title: title,
    rentorSale: rentorSale,
    konuttipitag: konuttipitag,
    odasayisitag: odasayisitag,
    konutkatitag: konutkatitag,
    esyadurumutag: esyadurumutag,
    banyosayisitag: banyosayisitag,
    binaOzellikleriTags: binaOzellikleriTags,
    description: description,
    price: parseInt(price),
    image: image.url,
    gallery: gallery,
    address: address,
    city: address.city,
  };

  try {
    // Bu kısmı kendi veritabanınızın adıyla değiştirin
    const result = await wixData.insert('Emlak', toInsert);
    $w('#emlakSuccessMessage').text = `${result.title} ilaniniz basariyla kaydedilmistir`;
    $w('#emlakSuccessMessage').show();
    // Formu gönderdikten sonra yapılacak işlemleri burada ekleyebilirsiniz.
    findIn('#home').all('TextInput').value = '';
    findIn('#home').all('Dropdown').value = null;
    findIn('#home').all('AddressInput').value = null;
    findIn('#home').all('CheckboxGroup').value = null;
    $w('#emlakgaleri').reset();
    $w('#emlakimage').reset();
  } catch (error) {
    $w('#emlakSuccessMessage').show();
    console.log('ERRORRRRRY');
    console.error('Error', error);
  } finally {
    setTimeout(() => {
      $w('#emlakSuccessMessage').hide();
      $w('#sendButtonEmlak').enable();
      $w('#emlakLoader').hide();
    }, 3000);
  }
});
function throwErrorUrun(message) {
  $w('#urunErrorMessage').text = message;
  $w('#urunErrorMessage').show();
  $w('#urunLoader').hide();
  $w('#sendButtonUrun').enable();
}

$w('#sendButtonUrun').onClick(async (event) => {
  $w('#urunLoader').show();
  $w('#sendButtonUrun').disable();
  $w('#urunSuccessMessage').hide();
  $w('#urunErrorMessage').hide();

  const currMember = await currentMember.getMember();
  if (!$w('#urunanagorselpage').value.length) {
    return throwErrorUrun('Lutfen ana gorsel ekleyiniz');
  }
  if (!$w('#uruntitlepage').value) {
    return throwErrorUrun('Lutfen ilan basligi ekleyiniz');
  }

  const mainimage = await $w('#urunanagorselpage').startUpload();

  const galleryurun = [];
  await $w('#urungaleripage')
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
    })
    .catch((uploadError) => {
      let errCode = uploadError.errorCode; // 7751
      let errDesc = uploadError.errorDescription; // "Error description"
    });
  let title = $w('#uruntitlepage').value;
  let kategori = $w('#dropdownkategori').value;
  let description = $w('#urunaciklamapage').value;
  let fiyaturun = $w('#urunfiyatpage').value;
  let address = $w('#addressInput3').value;
  let condition = $w('#dropdownkondisyon').value;
  let toInsert = {
    title: title,
    image: mainimage.url,
    description: description,
    kategori: kategori,
    fiyaturun: parseInt(fiyaturun),
    galleryurun: galleryurun,
    publicProfile: currMember,
    referenceMembers: currMember,
    urunKondisyon: condition,
    address: address,
    city: address.city,
  };
  try {
    // Bu kısmı kendi veritabanınızın adıyla değiştirin
    const result = await wixData.insert('Urun', toInsert);
    $w('#urunSuccessMessage').text = `${result.title} ilaniniz basariyla kaydedilmistir`;
    $w('#urunSuccessMessage').show();
    // Formu gönderdikten sonra yapılacak işlemleri burada ekleyebilirsiniz.
    findIn('#urun').all('TextInput').value = '';
    findIn('#urun').all('Dropdown').value = null;
    findIn('#urun').all('AddressInput').value = null;
    $w('#urungaleripage').reset();
    $w('#urunanagorselpage').reset();
  } catch (error) {
    $w('#urunSuccessMessage').show();
  } finally {
    setTimeout(() => {
      $w('#urunSuccessMessage').hide();
      $w('#sendButtonUrun').enable();
      $w('#urunLoader').hide();
    }, 3000);
  }
});

$w.onReady(function () {
  $w('#homebutton').onClick(() => {
    $w('#multiStateBox1').changeState('home');
  });
  $w('#aracbutton').onClick(() => {
    $w('#multiStateBox1').changeState('arac');
  });
  $w('#itemButton').onClick(() => {
    $w('#multiStateBox1').changeState('urun');
  });
});

export function itemButton_click(event) {
  $w('#multiStateBox1').show();
}

export function aracbutton_click(event) {
  $w('#multiStateBox1').show();
}

export function homebutton_click(event) {
  $w('#multiStateBox1').show();
}
const hasParent = (element, parentId) => {
  while (element) {
    // On each iteration, we get a next parent element
    element = element.parent;

    if (element?.id === parentId) {
      return true;
    }
  }

  return false;
};
export const findIn = (selector) => {
  // Removes a hash symbol at the selector start
  // Because the `element.id` doesn't have a hash (#) symbol in value.
  const parentId = selector.replace(/^#/, '');

  return {
    all(...type) {
      /** @type {$w.Node[]} */
      const elements = $w(type.join());

      const ids = elements.reduce((acc, element) => {
        // Add condition:
        // if the element has a parent node with the needed ID
        // then add it to the return result.
        if (hasParent(element, parentId)) {
          acc.push(`#${element.id}`);
        }

        return acc;
      }, []);

      return $w(ids.join());
    },
  };
};
