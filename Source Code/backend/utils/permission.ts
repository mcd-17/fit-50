interface Module {
    name: string;
    permission: string;
    child?: Array<{ name: string; permission: string }>;
}

const crud = [
    {
        name: 'Create',
        permission: 'create'
    },
    {
        name: 'Edit',
        permission: 'edit'
    },
    {
        name: 'Delete',
        permission: 'delete'
    },
    {
        name: 'View',
        permission: 'view'
    }
]

const modules: Module[] = [
    
{ 
  name:'Dashboard',
  permission:'dashboard_view'
 },
{ name:'Trainers',
  permission:'trainers_view',
  child:crud},
{ 
  name:'Members',
  permission:'user_list_view'
},
{ 
    name:'Group',
    permission:'group_view',
    child:crud
},
{ 
  name:'Blog',
  permission:'blog_view'
},
{ 
    name:'Blog Category',
    permission:'blog_category_view',
    child:crud
},
{ 
    name:'Blog Tag',
    permission:'blog_tag_view',
    child:crud
},
{ 
    name: 'Blogs',
    permission:'blogs_view',
    child:crud
},
{ 
    name:'Product',
    permission:'product_view'
},
{ 
    name:'Product Category',
    permission:'product_category_view',
    child:crud
},
{ 
    name: 'Product',
    permission:'product_view',
    child:crud
},
{    name:'Orders',
     permission:'order_view',
},
{    name:'Coupon',
     permission:'coupon_view',
     child:crud
},
{    name:'Testimonial',
     permission:'testimonial_view',
     child:crud
},
{   name:'Payment',
    permission:'payment_view'
},
{  name:'Payment Method',
   permission:'payment_method_view',
   child:crud
},
{  name:'Wallet',
   permission:'wallet_view'
},
{  name:'Currency',
   permission:'currency_view',
   child:crud
},
{  name:'Others',
   permission:'settings_view'
},
{  name:'Subscription Plan',
   permission:'pricing_view',
   child:crud
},
{   name:'Subscription History',
    permission:'subcription_view',
},
{   name:'Schedule',
    permission:'schedule_view',
    child:crud
},
{   name:'Service',
    permission:'services_view',
    child:crud
},
{   name:'Events',
    permission:'events_view',
    child:crud
},
{   name:'Newsletter',
    permission:'newsletter_view'
},
{   name:'Gallery',
    permission:'gallery_view',
    child:crud
},
{   name:'Features',
    permission:'feature_view',
    child:crud
},
{   name:'Contacts',
    permission:'contact_view',
    child:crud
},
{   name: 'HRM',
    permission:'hrm_view'
},
{   name: 'All Employee',
    permission:'employee_view',
    child:crud
},
{   name:'Roles and Permission',
    permission:'roles_view',
    child:crud
},
{   name:'Settings',
    permission:'settings_view'
},
{   name:'Settings',
    permission:'site_settings_view',
    child:crud
},
{   name:'Email Settings',
    permission:'email_settings_view',
    child:crud
},
{ 
    name:'Language',
    permission:'language_view',
    child:crud
},
{  
     name:'Faq',
     permission:'faq_view',
     child:crud
},
{ 
    name:'Page Settings',
    permission:'page_settings_view',
    child:crud
}

]


let permissions = modules?.map(m => {
    if (m.child) {
        return {
            ...m,
            child: m.child?.map(c => ({
                ...c,
                permission: `${m.permission}_${c.permission}`
            }))
        }
    }
    return m
})
export default permissions