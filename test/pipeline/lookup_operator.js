var test = require('tape')
var mingo = require('../../dist/mingo')
var samples = require('../support')
var _ = mingo._internal()



/**
 * Tests for $lookup operator
 */
test('$lookup pipeline operator', function (t) {
  var orders = [
    { "_id": 1, "item": "abc", "price": 12, "quantity": 2 },
    { "_id": 2, "item": "jkl", "price": 20, "quantity": 1 },
    { "_id": 3 }
  ]

  var inventory = [
    { "_id": 1, "sku": "abc", description: "product 1", "instock": 120 },
    { "_id": 2, "sku": "def", description: "product 2", "instock": 80 },
    { "_id": 3, "sku": "ijk", description: "product 3", "instock": 60 },
    { "_id": 4, "sku": "jkl", description: "product 4", "instock": 70 },
    { "_id": 5, "sku": null, description: "Incomplete" },
    { "_id": 6 }
  ]

  var result = mingo.aggregate(orders, [
    {
      $lookup: {
        from: inventory,
        localField: "item",
        foreignField: "sku",
        as: "inventory_docs"
      }
    }
  ])

  t.deepEqual(result, [
    {
      "_id": 1,
      "item": "abc",
      "price": 12,
      "quantity": 2,
      "inventory_docs": [
        { "_id": 1, "sku": "abc", description: "product 1", "instock": 120 }
      ]
    },
    {
      "_id": 2,
      "item": "jkl",
      "price": 20,
      "quantity": 1,
      "inventory_docs": [
        { "_id": 4, "sku": "jkl", "description": "product 4", "instock": 70 }
      ]
    },
    {
      "_id": 3,
      "inventory_docs": [
        { "_id": 5, "sku": null, "description": "Incomplete" },
        { "_id": 6 }
      ]
    }
  ], 'can apply $lookup operator')

  t.end()

})