import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


const DonutChart = ({ data }) => {
    const options = {
        chart: {
            type: 'pie',
            height: 300,
        },
        title: {
            text: '',
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                innerSize: '50%',
                dataLabels: {
                    enabled: true,
                    format: ' <b >{point.percentage:.1f} %</b>',
                    distance: -35,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textOutline: 'none',
                        fontSize: '14px',
                        textAlign: 'center',
                    },
                },
            },
        },
        series: [
            {
                name: 'Products',
                colorByPoint: true,
                data: [
                    {
                        name: 'Total Products Quantity',
                        y: data?.totalProduct,
                    },
                    {
                        name: 'Sold Products Quantity',
                        y: data?.soldProduct,
                    },
                    {
                        name: 'Existing Products Quantity',
                        y: data?.existingProduct,
                    },
                ],
            },
        ],
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />

            <div className='flex gap-3 justify-center'>
                <div className='flex items-center gap-1'>
                    <div className=' h-[8px] w-[8px] rounded-full bg-[#2CAFFE]' />{' '}
                    <p className='font-bold text-xs text-textBody'>Total Products Qty</p>
                </div>
                <div className='flex items-center gap-1'>
                    <div className=' h-[8px] w-[8px] rounded-full bg-[#544FC5]' />{' '}
                    <p className='font-bold text-xs text-textBody'>Sold Products Qty</p>
                </div>
                <div className='flex items-center gap-1'>
                    <div className=' h-[8px] w-[8px] rounded-full bg-[#00E272]' />{' '}
                    <p className='font-bold text-xs text-textBody'>Exist Products Qty</p>
                </div>
            </div>
        </div>
    );
};

export default DonutChart;
