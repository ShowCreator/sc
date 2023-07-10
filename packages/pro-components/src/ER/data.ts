/*
 * @Author: sfy
 * @Date: 2023-05-14 11:01:11
 * @LastEditors: sfy
 * @LastEditTime: 2023-05-14 11:34:33
 * @FilePath: /sqlG/src/Process/data.ts
 * @Description: update here
 */

export const dataTransform = (data) => {
  
  const nodes = [];
  const edges = [];

  data.map((node) => {
    nodes.push({
      ...node
    });
    if (node.attrs) {
      node.attrs.forEach((attr) => {
        if (attr.relation) {
          attr.relation.forEach((relation) => {
            edges.push({
              source: node.id,
              target: relation.nodeId,
              sourceKey: attr.key,
              targetKey: relation.key,
              label: relation.label,
            });
          });
        }

      });
    }
  });

  return {
    nodes,
    edges,
  };
}

export const mockData = [{
  "id": "info",
  "label": "Employee",
  "attrs": [{
      "key": "id",
      "type": "number(6)"
    },
    {
      "key": "key",
      "type": "varchar(255)"
    },
    {
      "key": "gender",
      "type": "enum(M, F)"
    },
    {
      "key": "birthday",
      "type": "date"
    },
    {
      "key": "hometown",
      "type": "varchar(255)"
    },
    {
      "key": "country",
      "type": "varchar(255)"
    },
    {
      "key": "nation",
      "type": "varchar(255)"
    },
    {
      "key": "jobId",
      "type": "number(3)",
      "relation": [{
        "key": "id",
        "nodeId": "job"
      }]
    },
    {
      "key": "phone",
      "type": "varchar(255)"
    },
    {
      "key": "deptId",
      "type": "number(6)",
      "relation": [{
        "key": "id",
        "nodeId": "dept"
      }]
    },
    {
      "key": "startTime",
      "type": "date"
    },
    {
      "key": "leaveTime",
      "type": "date"
    }
  ]
},
{
  "id": "job",
  "label": "Job",
  "attrs": [{
      "key": "id",
      "type": "number(3)"
    },
    {
      "key": "title",
      "type": "varchar(255)"
    },
    {
      "key": "level",
      "type": "number(3)"
    }
  ]
},
{
  "id": "dept",
  "label": "Department",
  "attrs": [{
      "key": "id",
      "type": "number(6)"
    },
    {
      "key": "title",
      "type": "varchar(255)"
    },
    {
      "key": "desc",
      "type": "text"
    },
    {
      "key": "parent",
      "type": "number(6)",
      "relation": [{
        "key": "id",
        "nodeId": "dept"
      }]
    },
    {
      "key": "manager",
      "type": "number(6)"
    }
  ]
}
]


export const data = dataTransform(mockData)