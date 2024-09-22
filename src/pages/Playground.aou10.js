// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world
import { services } from 'wix-bookings.v2';
import { activityCounters } from 'wix-activity-counters.v2';
import wixData from 'wix-data';

function filterAddsOnly(items) {
  return items.filter((item) => item.extendedFields?.namespaces?._user_fields?.reklam);
}
async function queryServices() {
  return await services
    .queryServices()
    .find()
    .then((data) => {
      return filterAddsOnly(data.items);
    });
}
async function incrementClickCount(serviceId) {
  console.log('click');
  wixData
    .query('ServiceClick')
    .eq('serviceId', serviceId)
    .find()
    .then((results) => {
      if (results.items.length > 0) {
        // If an entry exists, increment its count
        let currentItem = results.items[0];
        let newCount = currentItem.clickCount + 1;
        console.log('currentItem exist', currentItem);
        wixData.update('ServiceClick', {
          _id: currentItem._id,
          serviceId: currentItem.serviceId,
          clickCount: newCount,
        });
      } else {
        // If no entry exists, create a new one with count 1
        console.log('currentItem new', serviceId);
        wixData.insert('ServiceClick', {
          serviceId: serviceId,
          clickCount: 1,
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

$w.onReady(async function () {
  const filteredItems = await queryServices();
  $w('#repeater1').data = filteredItems;
  console.log('filtereditems', filteredItems);
  $w('#repeater1').forEachItem(($item, itemData, index) => {
    console.log(`item ${itemData.name}`, itemData);
    $item('#thumbnail').src = itemData.media.mainMedia.image;
    $item('#price').text = `CA$${itemData.payment.fixed.price.value}`;
    $item('#type').text = itemData.type;
    $item('#serviceName').text = itemData.name;
    $item('#cta').link = itemData.urls.servicePage;
    $item('#description').text = itemData.description;
    $item('#cta').onClick(() => {
      // Increment click count for the clicked item
      incrementClickCount(itemData._id);
    });
  });
});
