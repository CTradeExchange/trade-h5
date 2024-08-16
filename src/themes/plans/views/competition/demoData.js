const list = [
    {
        rank: 1,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 2,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 3,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 4,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 5,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 6,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 7,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 8,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 9,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 10,
        avatar: '',
        nickName: 'Cu1304',
        country: 'USA',
        countryCode: 'USD',
        profit: '125032',
        reward: '88888'
    },
]

const list1 = [
    {
        rank: 1,
        avatar: '',
        nickName: 'Ad67852',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 2,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 3,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 4,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 5,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 6,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 7,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 8,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 9,
        avatar: '',
        nickName: 'Cu1304',
        country: 'China',
        countryCode: 'CNY',
        profit: '125032',
        reward: '88888'
    },
    {
        rank: 10,
        avatar: '',
        nickName: 'Cu1304',
        country: 'USA',
        countryCode: 'USD',
        profit: '125032',
        reward: '88888'
    },
]

export const demoData = ({ params = {} }) => {
    const { type } = params || {}
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(type === 1 ? list : list1)
        }, 1000)
    })
}

export const getMyRaceList = ({ params = {} }) => {
    const { status, Offset, Limit } = params || {}
    return new Promise((resolve, reject) => {
        const arr = [
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 1',
                profitRank: 10,
                ProfitabilityRanking: 100,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 2,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 2',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 3',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 4',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 5',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 6',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 1',
                profitRank: 10,
                ProfitabilityRanking: 100,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 2,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 2',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 3',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 4',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 5',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 6',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 1',
                profitRank: 10,
                ProfitabilityRanking: 100,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 2,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 2',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 3',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 1,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 4',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 2,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 2',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 2,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 2',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 2,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 2',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 2,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 2',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
            {
                createdAt: '1678761782619',
                startAt: '1678761782619',
                endAt: '1678763782619',
                status: 2,
                type: 1,
                name: 'Riksbank Deputy Governor Jansson Deliverd a Speech 2',
                profitRank: 10,
                ProfitabilityRanking: 1000,
                reward: 888888
            },
        ]
        setTimeout(() => {
            let res = arr.filter(i => i.status === status)
            res = res.slice(0, Limit)
            resolve(res)
        }, 1000)
    })
}
