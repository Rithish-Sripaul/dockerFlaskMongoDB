
// To add reportTypeID to documents collection 
db.documents.aggregate([
    {
      $lookup: {
        from: "reportType",
        let: {
          reportTypeName: "$reportType",
          divisionID: "$divisionID"
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$name", "$$reportTypeName"] },
                  { $eq: ["$divisionID", "$$divisionID"] }
                ]
              }
            }
          }
        ],
        as: "reportTypeDetails"
      }
    },
    {
      $unwind: {
        path: "$reportTypeDetails",
        preserveNullAndEmptyArrays: false
      }
    },
    {
      $set: {
        reportTypeID: "$reportTypeDetails._id"
      }
    },
    {
      $unset: "reportTypeDetails"
    },
    {
      $merge: {
        into: "documents",
        whenMatched: "merge",
        whenNotMatched: "discard"
      }
    }
  ]);
  
// To add subReportTypeID to documents collection
db.documents.aggregate([
    {
      $lookup: {
        from: "reportType",
        let: { subReportTypeName: "$subReportType" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$name", "$$subReportTypeName"] },
                  { $eq: ["$isSubReportType", true] }
                ]
              }
            }
          }
        ],
        as: "subReportTypeDetails"
      }
    },
    {
      $set: {
        subReportTypeID: {
          $cond: {
            if: { $eq: ["$subReportType", ""] },
            then: null,
            else: { $arrayElemAt: ["$subReportTypeDetails._id", 0] }
          }
        }
      }
    },
    {
      $unset: "subReportTypeDetails"
    },
    {
      $merge: {
        into: "documents",
        whenMatched: "merge",
        whenNotMatched: "discard"
      }
    }
  ]);
  
db.divisions.insertOne(
    {
        name: "LCT",
        director: "",
        documentCount: 0,
        userCount: 0,
    }
)