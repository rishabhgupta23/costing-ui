import { CostHistory, CostHistoryResponse, PartRow } from "../data/models/part";

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
    categoryId: 1,
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

   export const MOCK_PART_WITH_BOM_ONLY = {
    ...MOCK_SINGLE_PART,
    vendorCostList: [],
    "bom": [
    {
        "childPartId": 1,
        "quantity": 5.0,
        "childPartName": "abc",
        "childPartNumber": "12"
    }
]
  };
  
  export const MOCK_COST_HISTORY_LIST: CostHistory[] = [
    {
      updatedDateTime: '2024-04-01T10:00:00Z',
      costFactorList: [
        { id: 1, name: 'Labor Cost', value: 100 }
      ]
    },
    {
      updatedDateTime: '2024-04-02T11:00:00Z',
      costFactorList: [
        { id: 2, name: 'Cost Price', value: 150 }
      ]
    }
  ];
  
  export const MOCK_PART_ROW_LIST: PartRow[] = [
    {
      partId: 1,
      partName: 'Gear Assembly',
      partNumber: 'GA-001',
      categoryName: 'Mechanical',
      type: 'Assembly',
      unit: 'PCS',
      vendorNames: ['Vendor A']
    },
    {
      partId: 2,
      partName: 'Motor Shaft',
      partNumber: 'MS-002',
      categoryName: 'Electrical',
      type: 'Component',
      unit: 'PCS',
      vendorNames: ['Vendor B']
    }
  ];
  
  