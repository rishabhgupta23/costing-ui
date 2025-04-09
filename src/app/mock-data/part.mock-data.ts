export const MOCK_PART_LIST_RESPONSE = {
    data: {
      partsList: [
        {
          partId: 1,
          partName: 'UPDATED PART',
          partNumber: '1234',
          categoryName: null,
          type: 'UNIT',
          unit: 'NOS',
          vendorNames: ['XYZ Company']
        },
        {
          partId: 2,
          partName: 'a',
          partNumber: 'a',
          categoryName: null,
          type: 'UNIT',
          unit: 'KG',
          vendorNames: []
        }
      ],
      maxVendorCount: 1
    },
    pageInfo: {
      pageNumber: 0,
      pageSize: 100,
      totalPages: 1,
      totalRecords: 2
    }
  };
  
  export const MOCK_SINGLE_PART = {
    partId: 1,
    partName: 'UPDATED PART',
    partNumber: '1234',
    categoryName: null,
    type: 'UNIT',
    unit: 'NOS',
    vendorCostList: [
      {
        id: 1,
        name: 'XYZ Company',
        address: 'XYZ Company, Patna, Bihar',
        emailId: 'xyz@gmail.com',
        contactNumber: '9999999999',
        costFactorValues: [
          { id: 1, name: 'Labor Cost', value: 400.0 },
          { id: 2, name: 'Cost Price', value: 200.0 }
        ]
      }
    ],
    bom: []
  };
  