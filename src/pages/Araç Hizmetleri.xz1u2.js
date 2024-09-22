$w.onReady(function () {
  $w('#dynamicDataset').onReady(() => {
    let carObj = $w('#dynamicDataset').getCurrentItem();
    if (carObj?.aracMediaGallery && carObj?.aracMediaGallery.length > 0) {
      $w('#thumbImage').hide();
    } else {
      $w('#thumbImage').show();
    }
    $w('#price').text = formatPrice(carObj.fiyat);
    $w('#kilometers').text = `${carObj.arackilometre.toLocaleString()} km`;
    $w('#email').text = carObj.email;
    if (carObj.phone) {
      $w('#phone').text = carObj.phone;
    } else {
      $w('#phone').hide();
      $w('#phoneLabel').hide();
    }
  });
});

function formatPrice(rawPrice) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(
    parseInt(rawPrice)
  );
}
