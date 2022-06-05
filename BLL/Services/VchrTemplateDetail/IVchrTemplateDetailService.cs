using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.VchrTemplateDetail
{
    public interface IVchrTemplateDetailService
    {
        List<A_TR_VchrTemplateDetail> GetAll(Expression<Func<A_TR_VchrTemplateDetail, bool>> predicate);
        List<GQ_GetLnkVoucherDetail> GetAllFromView(Expression<Func<GQ_GetLnkVoucherDetail, bool>> predicate);
        A_TR_VchrTemplateDetail Insert(A_TR_VchrTemplateDetail entity);
        A_TR_VchrTemplateDetail Update(A_TR_VchrTemplateDetail entity);
        void UpdateList(List<A_TR_VchrTemplateDetail> Lstservice);
        A_TR_VchrTemplateDetail GetById(int id);
        void Delete(int id);
    }
}
