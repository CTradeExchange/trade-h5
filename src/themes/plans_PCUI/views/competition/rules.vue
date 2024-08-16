<template>
    <div class='w-full bg-contentColor'>
        <div class='competition-rules-wrap'>
            <Loading :show='loading' />
            <router-view />
            <iframe class='iframe' scrolling='no' src='https://support.headline.net/raceRules' @load='load'></iframe>
            <van-icon name='arrow-left' @click='back' />
        </div>
    </div>
    <!-- <div class='page-cometition-rules'>
        <div class='rules-main'>
            <h3>Headline Trading Competition</h3>
            <section>
                <h4>Over view and rules</h4>
                <ul>
                    <li>
                        The competition is sponsored by Headline, and investors participate in the real account trading competition for transactions and settlements through the relevant subject matter of the event.
                    </li>
                    <li>
                        The eligibility of participants is determined by Headline. Participants compete in the form of individuals, automatically Register for transactions, and are responsible for their own profits and losses. All transactions must abide by the regulations of relevant regulatory agencies, exchanges and futures merchants.
                    </li>
                    <li>
                        During the big event, a competition will be set up. During the competition period, the participants will trade the relevant subject matter of the event through the platform to compete with all users of the platform for ranking, and the platform will update the ranking in real time.
                    </li>
                    <li>
                        The competition requires a minimum transaction amount of 5,000 USDT, regardless of region and asset size, and the competition will be conducted in one group.
                    </li>
                </ul>
            </section>
            <section>
                <h4>Prize Pool</h4>
                <div class='table-title'>
                    The competition is divided into three prize pools
                    <br /> to distribute bonuses, which are set as follows:
                </div>
                <div class='table-box'>
                    <el-table border :data='tableData' style='width: 100%'>
                        <el-table-column
                            v-for='col in columns'
                            :key='col.label'
                            :formatter='formatter'
                            :label='col.label'
                            :prop='col.prop'
                            :width='col.width'
                        />
                    </el-table>
                </div>
            </section>
            <section>
                <h4>Terms and Conditions</h4>
                <ol>
                    <li>
                        All participants must read these Terms and Conditions carefully. Participating in this event means that participants accept and agree to abide by these Terms and Conditions and the amendments, changes and replacements thereof, including the arrangements for receiving bonuses.
                    </li>
                    <li>
                        The company reserves the right to change, suspend or cancel this event at any time, as well as change the bonus, participation method and/or these terms and conditions of this event without prior notice or consent of anyone.
                    </li>
                    <li>
                        Participants must abide by the rules stated in the competition and these terms and conditions. Any violations will result in the disqualification of participation and award.
                    </li>
                    <li>
                        The Company has the sole and absolute discretion to determine whether a participant complies with the rules and requirements of the event and these Terms and Conditions, and the Company's decision on these Terms and Conditions shall be final and conclusive.
                    </li>
                    <li>
                        The winning results will be announced on Headline official website and Headline Telegram channel after the competition, and this is the final and irreversible decision, and the participants shall not object.
                    </li>
                    <li>
                        Winners must share the winning results on social platforms (not limited to Facebook, Telegram, Instagram, etc.) within five days from the day the results are announced, and send the Headline ID and relevant social platform screenshots to "@" and Designated as the winner of the [Headline Event Trading Competition] for identity verification and award collection. If the winner fails to provide the above-mentioned relevant personal information within five days from the day when the results are announced, or the personal information provided has any errors, omissions, repetitions or falsehoods that prevent the company from contacting the winner or verifying his identity, his/her The eligibility for the award will be cancelled, and other participants cannot be used as substitutes.
                    </li>
                    <li>
                        The personal data provided by the winners will be processed by the company's service providers and will only be used for identity verification and prize collection. Within 2 months after the end of the competition, the personal data provided by the winners in connection with this campaign will be deleted.
                    </li>
                    <li>
                        If any person is found to participate in this event deliberately with a false account, the company reserves the right to disqualify them from participating and winning prizes.
                    </li>
                    <li>
                        If the information submitted by the participants is delayed due to computer, network, telephone, technical failure or any other reasons, or the participants fail to participate in this activity or answer after the deadline, the company shall not be responsible for any responsibility, and the participants shall also The company shall not be held accountable.
                    </li>
                    <li>
                        The company reserves the final decision on the list of participants/winners, eligibility and all dates and times related to this event.
                    </li>
                    <li>
                        In case of any dispute regarding this activity, the company reserves the right of final decision.
                    </li>
                </ol>
            </section>
        </div>
    </div> -->
</template>

<script>
import { reactive, toRefs, h, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
    setup () {
        const router = useRouter()
        const state = reactive({
            tableData: [
                {
                    label: 'Profit',
                    values: [
                        'Total rewards * 50% * 40%',
                        'Total rewards * 50% * 20%',
                        'Total rewards * 50% * 10%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                    ],
                    type: 'list',
                },
                {
                    label: 'P&L (%)',
                    values: [
                        'Total rewards * 50% * 40%',
                        'Total rewards * 50% * 20%',
                        'Total rewards * 50% * 10%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                        'Total rewards * 50% * 30% / 7 = 4.28%',
                    ],
                    type: 'list',
                },
                {
                    label: 'Annual Ultimate Bonus',
                    values: ['Cumulative throughout the year'],
                },
            ],
            columns: [
                {
                    label: 'Prize Pool',
                    prop: 'label',
                    width: 100,
                },
                {
                    label: 'Rewards',
                    prop: 'values',
                },
            ],
        })
        const loading = ref(true)

        const formatter = (row, col, cell, index) => {
            const { type } = row || {}
            const column = col.getColumnIndex()
            let res = cell
            if (type !== 'list') return res
            if (column !== 1) return res
            res = cell.map((item, index) => {
                const line = h('div', {}, [
                    h(
                        'span',
                        {
                            class: 'rank',
                        },
                        `Rank ${index + 1}`,
                    ),
                    h(
                        'span',
                        {
                            class: 'value',
                        },
                        item,
                    ),
                ])
                return line
            })
            return res
        }

        const load = () => {
            loading.value = false
        }

        const back = () => {
            router.back()
        }

        return {
            formatter,
            ...toRefs(state),
            loading,
            back,
            load,
        }
    },
}
</script>

<style scoped lang="scss">
.iframe {
    height: 100%;
    width: 100%;
    flex: 1;
    background: var(--contentColor);
}
.competition-rules-wrap {
    height: 1750px;
    position: relative;
    padding: 15px;
    max-width: 960px;
    margin: 0 auto;
    .van-icon-arrow-left {
        position: absolute;
        top: 26px;
        left: 24px;
        font-size: 26px;
        cursor: pointer;
    }
}
.page-cometition-rules {
    flex: 1;
    background: var(--contentColor);
    display: flex;
    flex-direction: column;
    align-items: center;
    .rules-main {
        margin-bottom: 60px;
        color: var(--mainColor);
        max-width: 960px;
        padding: 0 30px;
        font-family: 'Roboto';
        & > h3 {
            font-size: 40px;
            text-align: center;
            padding: 20px 0;
            color: var(--mainColor);
        }
        section {
            color: #24262b;
            padding-bottom: 15px;
            & > h4 {
                font-size: 16px;
                color: #24262b;
            }
            .table-title {
                font-size: 16px;
                line-height: 25px;
            }
            & > ul {
                padding-left: 20px;
                list-style-type: decimal;
                list-style-position: outside;
                li {
                    font-size: 16px;
                    color: #24262b;
                    line-height: 25px;
                }
            }
            & > ol {
                padding-left: 20px;
                list-style-type: disc;
                list-style-position: outside;
                li {
                    font-size: 16px;
                    color: #24262b;
                    line-height: 25px;
                }
            }
            .table-box {
                margin: 15px 0;
                font-size: 14px;
                line-height: 26px;
                :deep {
                    .el-table__header {
                        th {
                            background: var(--colorf4);
                        }
                        .cell {
                            color: #24262b;
                            word-wrap: break-word;
                            word-break: normal;
                            font-weight: 500;
                        }
                    }
                    .rank {
                        display: inline-block;
                        min-width: 50px;
                        margin-right: 15px;
                    }
                    .value {
                        color: var(--primary);
                    }
                    .cell {
                        color: #24262b;
                        word-wrap: break-word;
                        word-break: normal;
                    }
                }
            }
        }
    }
}
</style>
