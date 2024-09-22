// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import wixLocation from 'wix-location';
import { getServices, getAdverts } from 'backend/homepage';
import { plans } from 'wix-pricing-plans.v2';

$w.onReady(async function () {
  $w('#productStrip').onViewportEnter((event) => {
    $w('#forumStrip').show();
  });
  const filteredItems = await getServices();
  $w('#bookingRepeater').data = filteredItems;
  console.log(filteredItems);
  $w('#bookingRepeater').forEachItem(($item, itemData) => {
    $item('#bookingThumbnail').src = itemData.media.mainMedia.image;
    $item('#bookingSessionDuration').text =
      `${itemData.schedule.availabilityConstraints.sessionDurations[0].toString()} dk`;
    // TODO: read the wixvelo doc for getting price data.
    // https://www.wix.com/velo/reference/wix-bookings-v2/services/servicesqueryresult/items
    $item('#bookingItem').onClick((e) => {
      wixLocation.to(itemData.urls.servicePage);
    });
    $item('#bookingCategory').text = itemData.category.name;
    $item('#bookingTitle').text = itemData.name;
    $item('#bookingDescription').text = itemData.description;
    if (itemData.payment.rateType === 'VARIED') {
      $item('#bookingPrice').text = formatPrice(itemData.payment.varied.defaultPrice.value);
    }
    if (itemData.payment.rateType === 'NO_FEE') {
      if (itemData.payment.pricingPlanIds.length > 1) {
        plans.getPlan(itemData.payment.pricingPlanIds[1]).then((plan) => {
          $item('#bookingPrice').text = formatPrice(plan.pricing.price.value);
        });
      } else if (itemData.payment.pricingPlanIds[0]) {
        plans.getPlan(itemData.payment.pricingPlanIds[0]).then((plan) => {
          $item('#bookingPrice').text = formatPrice(plan.pricing.price.value);
        });
      } else {
        $item('#bookingPrice').text = 'Ücretsiz';
      }
      // const pricePromises = itemData.payment.pricingPlanIds.map(planId => {
      //   return plans.getPlan(planId).then(plan=>{
      //     return  plan.pricing.price.value
      //   })
      // })

      // Promise.all(pricePromises).then(prices => {
      //   $item('#bookingPrice').text = prices.map(item => formatPrice(item)).toString()
      // })
    } else if (itemData.payment.rateType === 'FIXED') {
      $item('#bookingPrice').text = formatPrice(itemData.payment.fixed.price.value);
    }
  });
  // Arac ilanlari
  // await queryIlan();
});

// async function queryIlan() {
//   try {
//     const data = await getAdverts();

//     if (data.items.length > 0) {
//       $w('#ilanRepeater').data = data.items;
//       $w('#ilanRepeater').forEachItem(($item, itemData) => {
//         $item('#ilanThumbnail').src = itemData.image;
//         $item('#ilanCategory').text = itemData.selectedBrand;
//         $item('#ilanTitle').text = itemData.title;
//         $item('#ilanPrice').text = formatPrice(itemData.fiyat);
//         $item('#ilanMilage').text = `${itemData.arackilometre.toLocaleString()} km`;
//         $item('#ilanItem').onClick((e) => {
//           wixLocation.to(itemData['link-araba-title']);
//         });
//       });
//     } else {
//       $w('#ilanRepeater').hide();
//     }
//   } catch (error) {
//     console.error('Ilan yuklenirken bir hata oldu ', error.message);
//   }
// }

function formatPrice(rawPrice) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(
    parseInt(rawPrice)
  );
}
