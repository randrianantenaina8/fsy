function getFundingScaleDefaultCriteriaData() {
    return [
        {
            type: "descrip_13",
            criterionValue: {
                id: ""
            }
        },
        {
            type: "descrip_14",
            criterionValue: {
                id: ""
            }
        },
        {
            type: "general_02",
            criterionValue: {
                id: ""
            }
        },
        {
            type: "general_12",
            criterionValue: {
                id: ""
            }
        },
        {
            type: "local_01",
            criterionValue: {
                id: ""
            }
        },
        {
            type: "local_02",
            criterionValue: {
                id: ""
            }
        },
        {
            type: "general_01",
            criterionValue: {
                id: ""
            }
        }
    ]
}

function getFundingFixedAmountDefaultCriteriaData() {
    return [
        {
            type: "travaux_09",
            criterionValue: {
                id: ""
            }
        },
        {
            type: "travaux_23",
            criterionValue: {
                id: ""
            }
        },
    ]
}

function formatAidScaleValue(aidScaleValue) {
    const validCriteria = aidScaleValue.criteria
        .filter(item => item.criterionValue.id)
        .map(item => {
            return {
                type: item.type,
                criterionValue: `/api/criteria-value/${item.criterionValue.id}`
            }
        })

    return {
        specieGroup: aidScaleValue.specieGroup && aidScaleValue.specieGroup.id ? '/api/species-group/' + aidScaleValue.specieGroup.id : null,
        specie: aidScaleValue.specie && aidScaleValue.specie.id ? '/api/species/' + aidScaleValue.specie.id : null,
        rate: +aidScaleValue.rate,
        maximumAmountOfWork: aidScaleValue.maximumAmountOfWork ? +aidScaleValue.maximumAmountOfWork : null,
        criteria: validCriteria
    }
}

function formatAidPlanValue(aidPlanValue) {
    return {
        specieGroup: aidPlanValue.specieGroup && aidPlanValue.specieGroup.id ? '/api/species-group/' + aidPlanValue.specieGroup.id : null,
        specie: aidPlanValue.specie && aidPlanValue.specie.id ? '/api/species/' + aidPlanValue.specie.id : null,
        amount: aidPlanValue.amount !== "" ? +aidPlanValue.amount : null
    }
}

function formatAidFixedAmountValue(aidFixedAmountValue) {
    const validCriteria = aidFixedAmountValue.criteria
        .filter(item => item.criterionValue.id)
        .map(item => {
            return {
                type: item.type,
                criterionValue: `/api/criteria-value/${item.criterionValue.id}`
            }
        })

    return {
        amount: +aidFixedAmountValue.amount,
        criteria: validCriteria
    }
}

const exportedFunctions = {
    getFundingScaleDefaultCriteriaData,
    getFundingFixedAmountDefaultCriteriaData,
    formatAidScaleValue,
    formatAidPlanValue,
    formatAidFixedAmountValue
}

export default exportedFunctions
