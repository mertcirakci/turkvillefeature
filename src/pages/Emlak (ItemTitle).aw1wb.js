$w.onReady(function () {
  $w.onReady(() => {
    $w('#dynamicDataset').onReady(() => {
      let realEstateObj = $w('#dynamicDataset').getCurrentItem();
      if (realEstateObj?.gallery && realEstateObj.gallery.length > 0) {
        $w('#thumbImage').hide();
      } else {
        $w('#thumbImage').show();
      }

      // console.log(DOMPurify.sanitize(realEstateObj.description, { USE_PROFILES: { html: true } }))
      $w('#description').text = realEstateObj.description;
      $w('#price').text =
        realEstateObj.price === null
          ? 'Henüz Fiyat Belirtilmemiş'
          : formatPrice(realEstateObj.price);
      $w('#email').text = realEstateObj.email;
      if (realEstateObj.phone) {
        $w('#phone').text = realEstateObj.phone;
      } else {
        $w('#phone').hide();
        $w('#phoneLabel').hide();
      }
      // console.log(DOMPurify.sanitize("<div>hiii</div>"))
      // const safeHTML = DOMPurify.sanitize(realEstateObj.description);
      // console.log(safeHTML)
    });
  });
});

function formatPrice(rawPrice) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(
    parseInt(rawPrice)
  );
}
