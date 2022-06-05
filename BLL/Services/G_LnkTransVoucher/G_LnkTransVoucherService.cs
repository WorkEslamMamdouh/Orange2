 using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.G_LnkTransVoucherr
{
  public  class G_LnkTransVoucherService : IG_LnkTransVoucherService
    {
        private readonly IUnitOfWork unitOfWork;

        public G_LnkTransVoucherService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region AccDefAccountsService Services
        public GQ_GetLnkTransVoucher GetById(int id)
        {
            return unitOfWork.Repository<GQ_GetLnkTransVoucher>().GetById(id);
        }

        public List<GQ_GetLnkTransVoucher> GetAll()
        {
            return unitOfWork.Repository<GQ_GetLnkTransVoucher>().GetAll();
        }

        public List<GQ_GetLnkTransVoucher> GetAll(Expression<Func<GQ_GetLnkTransVoucher, bool>> predicate)
        {
            return unitOfWork.Repository<GQ_GetLnkTransVoucher>().Get(predicate);
        }

        public G_LnkTransVoucher Insert(G_LnkTransVoucher entity)
        {
            var AccDefAccount = unitOfWork.Repository<G_LnkTransVoucher>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public G_LnkTransVoucher Update(G_LnkTransVoucher entity)
        {

            var AccDefAccount = unitOfWork.Repository<G_LnkTransVoucher>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<G_LnkTransVoucher>().Delete(id);
            unitOfWork.Save();
        }


        public void DeleteLnkTransVoucher(int COMP_CODE, string SYSTEM_CODE , string SUB_SYSTEM_CODE, string TR_CODE, int SERIAL)
        {
            var TransVoucher = unitOfWork.Repository<G_LnkTransVoucher>().Get(x => x.COMP_CODE == COMP_CODE && x.SYSTEM_CODE == SYSTEM_CODE && x.TR_CODE == TR_CODE && x.SERIAL == SERIAL);
            unitOfWork.Repository<G_LnkTransVoucher>().Delete(TransVoucher); 
            unitOfWork.Save();
        }



        #endregion

    }
}
