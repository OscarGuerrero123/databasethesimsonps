const simsonpsModel = {
    getALL:`
        SELECT
                *
        FROM 
            simsonps
        `,
        getByID:`
          SELECT
                *
            FROM
                 simsonps
            WHERE
                id=?
      `,
      getByUsername:`
                   SELECT
                        *
                   FROM
                         simsonps
                  WHERE
                         name = ?

                       `,
      addRow:`
            INSERT INTO
                 simsonps(
                    password,
                    name,
                    total,
                    train,
                    test,
                    bounding_box,
                    is_active

                    )VALUES(                                                                                                                                                 
                         ?,?,?,?,?,?,?
                    )
                 `,
                 updateRow:`
                      UPDATE
                             simsonps
                        SET
                        password =?,
                        name =?,
                        total =?,
                        train =?,
                        test =?,
                        bounding_box =?,
                        is_active =?
                  WHERE
                       id = ?
                 `,
                 deleteRow:`
                      UPDATE
                           simsonps
                      SET 
                          is_active = 0
                      WHERE
                           id = ?
                           `,

}

module.exports = simsonpsModel