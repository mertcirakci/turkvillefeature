import wixData from 'wix-data';
import wixWindow from 'wix-window';
const TYPES = {
  PRODUCT: 'urun',
  VEHICLE: 'araba',
  REAL_ESTATE: 'ilan',
};

$w.onReady(function () {
  // Lightbox sayfasına iletilen öğe kimliğini al
  const itemId = wixWindow.lightbox.getContext().selectedItem.id;
  const type = wixWindow.lightbox.getContext().type;
  const title = wixWindow.lightbox.getContext().selectedItem.title;
  $w('#title').text = `"${title}" silmek istediginize emin misiniz?`;
  $w('#deleteButton').onClick(() => {
    itemId ? removeListing(itemId, type) : console.log('Silinecek öğe kimliği alınamadı.');
  });

  // Öğeyi veritabanından kaldırmak için kullanılan fonksiyon
  async function removeListing(itemID, type) {
    let collectionName;
    switch (type) {
      case TYPES.PRODUCT:
        collectionName = 'Urun';
        break;
      case TYPES.REAL_ESTATE:
        collectionName = 'Emlak';
        break;
      case TYPES.VEHICLE:
        collectionName = 'araba';
        break;
      default:
        console.error('Product type does not match');
        return;
    }

    try {
      await wixData.remove(collectionName, itemID);
      console.log('Öğe başarıyla silindi');
      wixWindow.lightbox.close();
      wixWindow.lightbox.getContext().refreshData = true;
    } catch (error) {
      console.error('Öğe silme hatası', error);
    }
  }
});
