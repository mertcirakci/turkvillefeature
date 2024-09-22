$w.onReady(function () {
  $w('#dynamicDataset').onReady(() => {
    let productObj = $w('#dynamicDataset').getCurrentItem();
    if (productObj?.galleryurun && productObj.galleryurun.length > 0) {
      $w('#thumbImage').hide();
    } else {
      $w('#thumbImage').show();
    }

    $w('#price').text = formatPrice(productObj.fiyaturun);
    $w('#email').text = productObj.email;
    if (productObj.phone) {
      $w('#phone').text = productObj.phone;
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
